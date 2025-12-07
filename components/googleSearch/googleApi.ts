"use server";

export interface SearchResult {
  title: string;
  link: string;
  snippet: string;
  metadata?: {
    image?: string;
    description?: string;
    siteName?: string;
    author?: string;
    publishedTime?: string;
    type?: string;
    favicon?: string;
  };
}

const API_KEY = "AIzaSyDPOfChEDX7uY6ZVU8uJAIaYe55627l0gk";
const CX_ID = "1243afd78b9d44365";

// --- 1. Web Sitesi Araması (Daha Katı Filtreleme) ---
export async function searchGoogleApi(query: string): Promise<SearchResult[]> {
  // 1. Tırnak içine alarak TAM eşleşme zorla: "Carter Injury Law"
  // 2. Alakasız rakipleri çıkar (Örnek: -Mario, -Kimmel, -Bertoldo)
  // 3. Dizin sitelerini (YellowPages vb.) filtrele (İsteğe bağlı)

  const exactQuery = `"${query}" -Mario -Kimmel -Bertoldo -directory -yellowpages`;

  const url = `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${CX_ID}&q=${encodeURIComponent(
    exactQuery
  )}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (!data.items) return [];

    // İkinci Katman Filtreleme (Kod içinde kontrol)
    const filteredItems = data.items.filter((item: any) => {
      const title = item.title.toLowerCase();
      const snippet = item.snippet.toLowerCase();
      const q = query.toLowerCase();

      // Sonuç başlığında veya açıklamasında aranan şirket adı GEÇMEK ZORUNDA
      return title.includes(q) || snippet.includes(q);
    });

    return filteredItems.map((item: any) => mapToSearchResult(item));
  } catch (error) {
    console.error("API Search Failed", error);
    return [];
  }
}

// --- 2. Sosyal Medya Araması (Sadece Resmi Hesaplar) ---
export async function searchSocialMedia(companyName: string) {
  // Sosyal medya profillerini bulmak için sadece "Carter Injury Law" başlığını içeren sayfaları arar.
  // 'intitle:' operatörü sayfa başlığında ismin geçmesini zorunlu kılar.

  const socialQuery = `intitle:"${companyName}" (site:linkedin.com/company OR site:facebook.com OR site:instagram.com OR site:twitter.com OR site:youtube.com)`;

  const url = `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${CX_ID}&q=${encodeURIComponent(
    socialQuery
  )}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (!data.items) return [];

    // Alakasız sonuçları (örneğin "Carter Injury Law" hakkında konuşan rastgele birinin gönderisi) filtrele
    const filteredSocials = data.items.filter((item: any) => {
      const title = item.title.toLowerCase();
      const link = item.link.toLowerCase();
      const company = companyName.toLowerCase();

      // Başlıkta şirket adı geçmeli VE link "posts" veya "status" olmamalı (sadece profil sayfaları)
      const isProfile =
        !link.includes("/posts/") &&
        !link.includes("/status/") &&
        !link.includes("/groups/");
      const hasName = title.includes(company);

      return isProfile && hasName;
    });

    return filteredSocials.map((item: any) => mapToSearchResult(item));
  } catch (error) {
    console.error("Social Search Failed", error);
    return [];
  }
}

// Ortak Veri Eşleştirme Fonksiyonu
function mapToSearchResult(item: any): SearchResult {
  const pagemap = item.pagemap || {};
  const metatags = pagemap.metatags?.[0] || {};
  const cseImage = pagemap.cse_image?.[0] || {};

  return {
    title: item.title,
    link: item.link,
    snippet: item.snippet,
    metadata: {
      image: metatags["og:image"] || cseImage.src,
      description: metatags["og:description"] || item.snippet,
      siteName: metatags["og:site_name"],
      author: metatags["author"] || metatags["article:author"],
      publishedTime: metatags["article:published_time"],
      type: metatags["og:type"],
      favicon: undefined, // Google API favicon vermez, bunu UI tarafında proxy ile hallediyoruz
    },
  };
}
