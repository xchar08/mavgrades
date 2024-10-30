"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import debounce from "lodash.debounce";
import { FaSearch } from "react-icons/fa";

interface Suggestion {
   suggestion: string;
   type: string;
}
interface SearchBarProps {
   initialValue?: string;
   resetState?: () => void;
   course?: string;
   professor?: string;
}

export default function SearchBar({
   initialValue = "",
   resetState,
   course,
   professor,
}: SearchBarProps) {
   const [searchInput, setSearchInput] = useState(initialValue);
   const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
   const [isLoading, setIsLoading] = useState(false);
   const router = useRouter();

   useEffect(() => {
      setSearchInput(initialValue); // Update input when initialValue changes
   }, [initialValue]);

   // Create a debounced version of the fetchSuggestions function
   const fetchSuggestions = useRef(
      debounce(async (input: string) => {
         if (input.length > 1) {
            setIsLoading(true); // Start loading
            try {
               const response = await fetch(
                  `/api/courses/search?query=${input}`
               );
               const data = await response.json();
               setSuggestions(data);
            } catch (error) {
               console.error("Error fetching suggestions:", error);
               setSuggestions([]); // Clear suggestions on error
            } finally {
               setIsLoading(false); // Stop loading
            }
         } else {
            setSuggestions([]);
         }
      }, 100) // Decrease the debounce time for quicker suggestion response, but might lead to more backend calls
   ).current;

   useEffect(() => {
      return () => {
         fetchSuggestions.cancel(); // Clean up on unmount
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   const handleSearch = (suggestion: string) => {
      setSearchInput(suggestion);
      setSuggestions([]);

      if (!(course === suggestion || professor === suggestion)) {
         if (resetState) {
            resetState();
         }
      }
      // Check if the suggestion is a professor or a course
      const isProfessor = suggestions.find(
         (s) => s.suggestion === suggestion && s.type === "professor"
      );

      if (isProfessor) {
         router.push(`/results?professor=${encodeURIComponent(suggestion)}`); // Redirect to professor results
      } else {
         router.push(`/results?course=${encodeURIComponent(suggestion)}`); // Redirect to course results
      }
   };

   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.target.value;
      setSearchInput(input);
      fetchSuggestions(input); // Call the debounced function
   };

   return (
      <div className="relative w-full max-w-lg mx-auto">
         <div className="relative">
            <input
               type="text"
               placeholder="Search for a course or professor"
               value={searchInput}
               onChange={handleInputChange}
               className="w-full p-3 border border-gray-500 rounded-xl shadow-sm focus:outline-none focus:border-blue-500 bg-white bg-opacity-10"
            />
            <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 w-4 h-4" />
         </div>
         {isLoading && (
            <div className="absolute w-full max-h-60 bg-gray-200 border border-gray-500 rounded-lg mt-2 shadow-lg z-10 text-black"></div>
         )}
         {suggestions.length > 0 && !isLoading && (
            <ul className="absolute w-full max-h-60 bg-white border border-gray-300 rounded-lg mt-2 shadow-lg z-10 overflow-y-scroll">
               {suggestions.map((suggestion, index) => (
                  <li
                     key={index}
                     onClick={() => handleSearch(suggestion.suggestion)}
                     className="px-4 py-2 hover:bg-blue-100 cursor-pointer text-black"
                  >
                     {suggestion.suggestion}
                  </li>
               ))}
            </ul>
         )}
      </div>
   );
}
