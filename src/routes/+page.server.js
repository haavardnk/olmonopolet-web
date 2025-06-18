import { format, parseISO } from "date-fns";
import { nb } from "date-fns/locale";

function formatDate(dateString) {
  if (!dateString) return "";

  try {
    const date = parseISO(dateString);
    let formatted = format(date, "d. MMMM yyyy", { locale: nb });
    // Capitalize first letter of month
    return formatted.replace(/\d+ ([^ ]+)/, (match, month) => {
      return match.replace(
        month,
        month.charAt(0).toUpperCase() + month.slice(1),
      );
    });
  } catch (error) {
    console.error("Date parsing error:", error);
    return dateString;
  }
}

export async function load({ fetch }) {
  try {
    const apiUrl = `https://api.beermonopoly.com/release/?fields=name,release_date,beer_count,product_selections`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(
        `API returned ${response.status}: ${response.statusText}`,
      );
    }

    const data = await response.json();

    const releases = (data.results || []).map((release) => {
      return {
        ...release,
        formatted_date: formatDate(release.release_date),
      };
    });

    return {
      releases,
    };
  } catch (error) {
    console.error("Error fetching releases:", error);

    return {
      releases: [],
      error: {
        message: error.message,
        status: error.status || 500,
      },
    };
  }
}
