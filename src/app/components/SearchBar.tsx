"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchBar({ initialValue = '' }) {
  const [searchInput, setSearchInput] = useState(initialValue);
  const [suggestions, setSuggestions] = useState([]);
  const router = useRouter();

  useEffect(() => {
    setSearchInput(initialValue); // Update input when initialValue changes
  }, [initialValue]);

  const fetchSuggestions = async (input: string) => {
    if (input.length > 1) {
      const response = await fetch(`/api/courses/search?query=${input}`);
      const data = await response.json();
      setSuggestions(data);
    } else {
      setSuggestions([]);
    }
  };

  const handleSearch = (suggestion: string) => {
  setSearchInput(suggestion);
  setSuggestions([]);

  // Check if the suggestion is a professor or a course
  const isProfessor = suggestions.find(s => s.suggestion === suggestion && s.type === 'professor');

  if (isProfessor) {
    router.push(`/results?professor=${encodeURIComponent(suggestion)}`); // Redirect to professor results
  } else {
    router.push(`/results?course=${encodeURIComponent(suggestion)}`); // Redirect to course results
  }
};

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
                  onClick={() => handleSearch(suggestion.suggestion)} 
                  className="px-4 py-2 hover:bg-indigo-100 cursor-pointer"
              >
                  {suggestion.suggestion} 
              </li>
          ))}
        </ul>
      )}
    </div>
  );
}
