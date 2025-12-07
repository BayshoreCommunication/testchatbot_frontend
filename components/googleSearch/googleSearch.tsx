"use client";

import { useState } from "react";
// ⚠️ IMPORTANT: Ensure your googleApi.ts file actually exports 'searchSocialMedia'
import {
  BiErrorCircle,
  BiGlobe,
  BiLogoFacebook,
  BiLogoInstagram,
  BiLogoLinkedin,
  BiLogoTwitter,
  BiLogoYoutube,
  BiSearch,
} from "react-icons/bi";
import { searchGoogleApi, SearchResult, searchSocialMedia } from "./googleApi";

export default function GoogleSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rawJsonData, setRawJsonData] = useState<any>(null);

  const handleSearch = async () => {
    if (!query.trim()) {
      setError("Please enter a search query");
      return;
    }

    setLoading(true);
    setError("");
    setResults([]);

    try {
      console.log("🚀 Starting search for:", query);

      // Run both searches in parallel
      const [webResults, socialResults] = await Promise.all([
        searchGoogleApi(query),
        searchSocialMedia(query),
      ]);

      console.log("✅ Web Results:", webResults.length);
      console.log("✅ Social Results:", socialResults.length);

      // Combine: Websites first, then Social Media
      const combinedResults = [...webResults, ...socialResults];
      setResults(combinedResults);

      // Store raw JSON data for display
      setRawJsonData({
        query: query,
        timestamp: new Date().toISOString(),
        webResults: webResults,
        socialResults: socialResults,
        totalResults: combinedResults.length,
      });

      if (combinedResults.length === 0) {
        setError("No results found. Try a different company name.");
      }
    } catch (err) {
      console.error("❌ Search Error Details:", err);
      setError("Search failed. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return null;
    }
  };

  const getDomainFromUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.replace("www.", "");
    } catch {
      return url;
    }
  };

  const getPlatformIcon = (link: string) => {
    const l = link.toLowerCase();
    if (l.includes("linkedin"))
      return <BiLogoLinkedin className="w-6 h-6 text-[#0077b5]" />;
    if (l.includes("facebook"))
      return <BiLogoFacebook className="w-6 h-6 text-[#1877F2]" />;
    if (l.includes("twitter") || l.includes("x.com"))
      return <BiLogoTwitter className="w-6 h-6 text-black" />;
    if (l.includes("instagram"))
      return <BiLogoInstagram className="w-6 h-6 text-[#E4405F]" />;
    if (l.includes("youtube"))
      return <BiLogoYoutube className="w-6 h-6 text-[#FF0000]" />;
    return <BiGlobe className="w-6 h-6 text-gray-400" />;
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8 text-center md:text-left">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          <span className="text-blue-600">G</span>
          <span className="text-red-600">o</span>
          <span className="text-yellow-500">o</span>
          <span className="text-blue-600">g</span>
          <span className="text-green-600">l</span>
          <span className="text-red-600">e</span> Data Scraper
        </h1>
        <p className="text-gray-600">
          Enter a company name to find Website & Social Profiles
        </p>
      </div>

      {/* Input Section */}
      <div className="mb-10">
        <div className="flex flex-col md:flex-row gap-3">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="e.g. Carter Injury Law"
            className="flex-1 px-6 py-4 text-lg border border-gray-300 rounded-full focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 shadow-sm transition-all"
            disabled={loading}
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-8 py-4 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all font-medium shadow-md hover:shadow-lg flex items-center justify-center gap-2 min-w-[140px]"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Scanning...</span>
              </>
            ) : (
              <>
                <BiSearch className="w-5 h-5" />
                <span>Search</span>
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-xl flex items-center gap-2 border border-red-100">
            <BiErrorCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}
      </div>

      {/* Results Section */}
      {!loading && results.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">
              Found {results.length} Result{results.length !== 1 ? "s" : ""}
            </h2>
          </div>

          {results.map((result, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl hover:border-blue-200 transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row">
                {/* Visual Preview / Icon */}
                <div className="md:w-64 h-48 md:h-auto relative flex-shrink-0 bg-gray-50 flex items-center justify-center border-b md:border-b-0 md:border-r border-gray-100">
                  {result.metadata?.image ? (
                    <img
                      src={`https://wsrv.nl/?url=${encodeURIComponent(
                        result.metadata.image
                      )}&w=400&h=300&fit=cover`}
                      alt={result.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        // Fallback to icon if image fails
                        (e.target as HTMLImageElement).style.display = "none";
                        (
                          e.target as HTMLImageElement
                        ).nextElementSibling?.classList.remove("hidden");
                      }}
                    />
                  ) : (
                    // Fallback Icon
                    <div className="p-6 bg-white rounded-full shadow-sm">
                      {getPlatformIcon(result.link)}
                    </div>
                  )}
                  {/* Backup Icon hidden by default, shown if image error */}
                  <div className="hidden absolute inset-0 flex items-center justify-center bg-gray-50">
                    <div className="p-6 bg-white rounded-full shadow-sm">
                      {getPlatformIcon(result.link)}
                    </div>
                  </div>
                </div>

                {/* Content Details */}
                <div className="flex-1 p-6">
                  {/* Metadata Header */}
                  <div className="flex items-center gap-2 mb-3">
                    {result.metadata?.favicon ? (
                      <img
                        src={`https://wsrv.nl/?url=${encodeURIComponent(
                          result.metadata.favicon
                        )}&w=32&h=32&fit=cover`}
                        alt=""
                        className="w-5 h-5 rounded-sm"
                        referrerPolicy="no-referrer"
                        onError={(e) =>
                          ((e.target as HTMLImageElement).style.display =
                            "none")
                        }
                      />
                    ) : (
                      getPlatformIcon(result.link)
                    )}

                    <span className="text-sm font-medium text-gray-600 truncate max-w-[200px]">
                      {result.metadata?.siteName ||
                        getDomainFromUrl(result.link)}
                    </span>

                    {result.metadata?.type && (
                      <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full font-medium border border-blue-100 capitalize">
                        {result.metadata.type}
                      </span>
                    )}
                  </div>

                  <a
                    href={result.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xl md:text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2"
                  >
                    {result.title}
                  </a>

                  <p className="text-sm text-green-700 mb-3 font-medium truncate">
                    {result.link}
                  </p>

                  <p className="text-gray-600 leading-relaxed mb-4 line-clamp-3 text-sm">
                    {result.metadata?.description || result.snippet}
                  </p>

                  {/* Metadata Footer */}
                  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 pt-4 border-t border-gray-100">
                    {result.metadata?.author && (
                      <span className="flex items-center gap-1.5">
                        <span className="font-semibold text-gray-700">
                          Author:
                        </span>{" "}
                        {result.metadata.author}
                      </span>
                    )}
                    {result.metadata?.publishedTime && (
                      <span className="flex items-center gap-1.5">
                        <span className="font-semibold text-gray-700">
                          Published:
                        </span>{" "}
                        {formatDate(result.metadata.publishedTime)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State / Start Guide */}
      {!loading && results.length === 0 && !error && (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-300">
          <BiSearch className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg font-medium">Ready to scrape</p>
          <p className="text-gray-400 text-sm mt-1">
            Type a company name above to find their web & social presence.
          </p>
        </div>
      )}

      {/* Raw JSON Response Display */}
      {rawJsonData && (
        <div className="mt-12 border-t-2 border-gray-200 pt-8">
          <div className="bg-gray-900 rounded-2xl overflow-hidden shadow-2xl">
            <div className="bg-gray-800 px-6 py-4 flex items-center justify-between border-b border-gray-700">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <span className="text-green-400">{"{"}</span>
                Raw JSON Response
                <span className="text-green-400">{"}"}</span>
              </h3>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    JSON.stringify(rawJsonData, null, 2)
                  );
                  alert("JSON copied to clipboard!");
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
              >
                Copy JSON
              </button>
            </div>
            <div className="p-6 overflow-x-auto">
              <pre className="text-sm text-green-400 font-mono leading-relaxed">
                {JSON.stringify(rawJsonData, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
