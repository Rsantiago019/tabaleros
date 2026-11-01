(() => {
  const config = window.TABALEROS_SUPABASE_CONFIG;
  const list = document.querySelector("#show-list");
  const source = document.querySelector("#agenda-source");
  const message = document.querySelector("#agenda-message");

  if (
    !config ||
    !config.url ||
    !config.anonKey ||
    config.url.includes("TU-PROYECTO") ||
    config.anonKey.includes("TU_CLAVE")
  ) {
    return;
  }

  if (!window.supabase || typeof window.supabase.createClient !== "function") {
    source.textContent = "Agenda no disponible";
    message.textContent = "No se pudo cargar el cliente de Supabase. Revisá tu conexión e intentá nuevamente.";
    return;
  }

  const client = window.supabase.createClient(config.url, config.anonKey);
  const dateFormatter = new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });

  function makeTextElement(tagName, className, value) {
    const element = document.createElement(tagName);
    element.className = className;
    element.textContent = value;
    return element;
  }

  function makeShowCard(show) {
    const article = document.createElement("article");
    article.className = "grid gap-4 py-6 sm:grid-cols-[1fr_1.2fr_1.4fr_auto] sm:items-center";

    const date = new Date(`${show.event_date}T12:00:00Z`);
    const dateLabel = Number.isNaN(date.getTime())
      ? show.event_date
      : dateFormatter.format(date);
    article.append(makeTextElement("p", "display-type text-xl font-bold uppercase text-gold", dateLabel));

    const location = document.createElement("div");
    location.append(makeTextElement("p", "font-bold", show.city));
    location.append(makeTextElement("p", "mt-1 text-sm text-white/50", "Argentina"));
    article.append(location);
    article.append(makeTextElement("p", "text-sm text-white/70", show.venue));

    if (show.sold_out) {
      const soldOut = makeTextElement(
        "span",
        "inline-flex w-fit cursor-not-allowed items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-xs font-bold text-white/45",
        "Sold out ×",
      );
      soldOut.setAttribute("aria-label", "Entradas agotadas");
      article.append(soldOut);
    } else if (show.ticket_url) {
      if (URL.canParse(show.ticket_url) && new URL(show.ticket_url).protocol === "https:") {
        const ticketUrl = new URL(show.ticket_url);
        const ticketLink = makeTextElement(
          "a",
          "inline-flex w-fit items-center gap-2 rounded-full bg-coral px-5 py-2.5 text-xs font-bold transition hover:bg-rose-400",
          "Comprar entradas ↗",
        );
        ticketLink.href = ticketUrl.href;
        ticketLink.target = "_blank";
        ticketLink.rel = "noopener noreferrer";
        article.append(ticketLink);
      } else {
        console.error("La agenda contiene una URL de entradas inválida:", show.id);
        article.append(makeTextElement("span", "text-xs text-rose-300", "Enlace de entradas no válido"));
      }
    } else {
      article.append(makeTextElement("span", "text-xs text-white/50", "Entradas próximamente"));
    }

    return article;
  }

  // Los shows se tratan como hora local de Argentina (UTC-3), a las 21:00.
  function showStart(show) {
    return new Date(`${show.event_date}T21:00:00-03:00`);
  }

  let countdownTimer;
  function startCountdown(shows) {
    const box = document.querySelector("#countdown");
    if (!box) return;
    const upcoming = shows.find((show) => !show.sold_out && showStart(show) > new Date()) || shows.find((show) => showStart(show) > new Date());
    if (!upcoming) return;

    const target = showStart(upcoming);
    document.querySelector("#countdown-title").textContent = `${upcoming.city} · ${upcoming.venue}`;
    const timer = document.querySelector("#countdown-timer");

    function tick() {
      const diff = target - new Date();
      if (diff <= 0) {
        clearInterval(countdownTimer);
        timer.textContent = "¡Es hoy!";
        return;
      }
      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      timer.textContent = `${days}d ${String(hours).padStart(2, "0")}h ${String(minutes).padStart(2, "0")}m ${String(seconds).padStart(2, "0")}s`;
    }

    tick();
    clearInterval(countdownTimer);
    countdownTimer = setInterval(tick, 1000);
    box.hidden = false;
  }

  // Datos estructurados para que Google pueda mostrar los shows como eventos.
  function addEventSchema(shows) {
    const events = shows.map((show) => ({
      "@type": "MusicEvent",
      name: `Los Tabaleros en ${show.city}`,
      startDate: showStart(show).toISOString(),
      eventStatus: "https://schema.org/EventScheduled",
      location: {
        "@type": "Place",
        name: show.venue,
        address: { "@type": "PostalAddress", addressLocality: show.city, addressCountry: "AR" },
      },
      performer: { "@type": "MusicGroup", name: "Los Tabaleros" },
      offers: {
        "@type": "Offer",
        availability: show.sold_out ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
        ...(show.ticket_url && URL.canParse(show.ticket_url) && new URL(show.ticket_url).protocol === "https:"
          ? { url: new URL(show.ticket_url).href }
          : {}),
      },
    }));
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(events);
    document.head.append(script);
  }

  async function loadShows() {
    source.textContent = "Agenda oficial";
    message.textContent = "Cargando fechas…";
    list.replaceChildren();

    const today = new Date();
    const todayString = [
      today.getFullYear(),
      String(today.getMonth() + 1).padStart(2, "0"),
      String(today.getDate()).padStart(2, "0"),
    ].join("-");

    const { data, error } = await client
      .from("shows")
      .select("id, event_date, city, venue, ticket_url, sold_out")
      .gte("event_date", todayString)
      .order("event_date", { ascending: true });

    if (error) {
      source.textContent = "Error al cargar la agenda";
      message.textContent = "No se pudieron cargar las fechas. Revisá la configuración de Supabase.";
      console.error("No se pudo cargar la agenda:", error.message);
      return;
    }

    if (!data.length) {
      message.textContent = "Todavía no hay fechas publicadas.";
      return;
    }

    const fragment = document.createDocumentFragment();
    data.forEach((show) => fragment.append(makeShowCard(show)));
    list.append(fragment);
    message.textContent = "";
    startCountdown(data);
    addEventSchema(data);
  }

  loadShows().catch((error) => {
    source.textContent = "Error al cargar la agenda";
    message.textContent = "Ocurrió un error inesperado al cargar las fechas.";
    console.error("Error inesperado al cargar la agenda:", error);
  });
})();
