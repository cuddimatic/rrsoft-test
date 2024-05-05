import React, { useState } from "react";
import { Article } from "../types/Article";
import { baseURL } from "../utils/apis";
import "../App.css";

const Results: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [filteredArticles, setFilteredArticles] = useState<Article[] | null>(null); // State to store filtered articles
  const [searched, setSearched] = useState(false); // State to track if search has been performed
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setError("Please enter a search term");
      return;
    }

    setLoading(true); 

    try {
      const [postsResponse, usersResponse] = await Promise.all([
        fetch(`${baseURL}/posts`),
        fetch(`${baseURL}/users`),
      ]);

      if (!postsResponse.ok || !usersResponse.ok) {
        throw new Error("Error fetching results");
      }

      const postsData = await postsResponse.json();
      const usersData = await usersResponse.json();

      const combinedResults = [
        ...postsData.map((post: { userId: any; }) => ({ ...post, type: "post", userId: post.userId })),
        ...usersData.map((user: any) => ({ ...user, type: "user" })),
      ];

      setError(null);
      setSearched(true);

      const authorResults = combinedResults.filter((result) => 
        result.type === "user" && 
        result.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );

      if (authorResults.length > 0) {
        const authorIds = authorResults.map((user) => user.id);
        const filteredPosts = combinedResults.filter((article) => 
          article.type === "post" && authorIds.includes(article.userId)
        );
        setFilteredArticles(filteredPosts);
      } else {
        const titleResults = combinedResults.filter((result) => 
          result.type === "post" && 
          result.title?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredArticles(titleResults);
      }
    } catch (error) {
      setError("Error fetching results");
    } finally {
      setLoading(false); // Set loading state to false when search is complete
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setError(null);
  };

  return (
    <div className="search_wrapper">
      <h1>Search Articles</h1>
      <div className="artcles_input">
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          placeholder="Search by author name or title"
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      <div className="list_section">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            {error ? (
              <p className="error">{error}</p>
            ) : (
              <>
                {filteredArticles && filteredArticles.length > 0 ? (
                  <ul>
                    {filteredArticles.map((article) => (
                      <li key={article.id}>
                       <p> <b>Title:</b> {article.title}</p>
                        <p><b>body:</b> {article.body}</p>
                      </li>
                    ))}
                  </ul>
                ) : searched ? (
                  <p>No articles found</p>
                ) : null}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};


export default Results
