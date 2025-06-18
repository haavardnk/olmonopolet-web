import { formatDate } from "$lib/utils.js";

export async function load({ fetch }) {
  try {
    const apiUrl = `https://api.beermonopoly.com/release/?fields=name,release_date,beer_count,product_selections,product_stats`;
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
