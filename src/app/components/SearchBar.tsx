"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchBar({ initialValue = '' }) {
  const [searchInput, setSearchInput] = useState(initialValue);
  const [suggestions, setSuggestions] = useState([]);
  const router = useRouter();

  useEffect(() => {
    setSearchInput(initialValue); // Update input when initialValue changes
  }, [initialValue]);

  const fetchSuggestions = async (input) => {
    if (input.length > 1) {
      const response = await fetch(`/api/courses/search?query=${input}`);
      const data = await response.json();
      setSuggestions(data);
    } else {
      setSuggestions([]);
    }
  };

  const handleSearch = (suggestion) => {
    setSearchInput(suggestion);
    setSuggestions([]);
    // Update the URL to trigger the page refresh
    router.push(`/results?course=${encodeURIComponent(suggestion)}`);
  };

  const handleInputChange = (e) => {
    const input = e.target.value;
    setSearchInput(input);
    fetchSuggestions(input);
  };

  return (
    <div className="relative w-full max-w-lg mx-auto">
      <input
        type="text"
        placeholder="Search for a course or professor"
        value={searchInput}
        onChange={handleInputChange}
        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-indigo-500"
      />
      {suggestions.length > 0 && (
        <ul className="absolute w-full max-h-60 bg-white border border-gray-300 rounded-lg mt-2 shadow-lg z-10 overflow-y-scroll">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSearch(suggestion)}
              className="px-4 py-2 hover:bg-indigo-100 cursor-pointer"
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
