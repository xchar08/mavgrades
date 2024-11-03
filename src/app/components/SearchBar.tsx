"use client";
import React, { useState, useEffect, useRef } from "react";
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
   const [searchInput, setSearchInput] = useState<string>(initialValue);
   const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
   const [isLoading, setIsLoading] = useState<boolean>(false);
   const [placeholderText, setPlaceholderText] = useState<string>("");
   const router = useRouter();
   const typingTimeout = useRef<number | null>(null);

   useEffect(() => {
      setSearchInput(initialValue);
   }, [initialValue]);

   // writing animation for placeholder
   useEffect(() => {
      const fullText = "Search for a course or professor";
      let index = 0;
      let isTyping = true;

      const type = () => {
         setPlaceholderText(fullText.slice(0, index));

         if (isTyping) {
            if (index < fullText.length) {
               index++;
               typingTimeout.current = window.setTimeout(type, 100);
            } else {
               isTyping = false;
               typingTimeout.current = window.setTimeout(type, 4000);
            }
         }
         // reverse animation
         else {
            if (index > 0) {
               index--;
               typingTimeout.current = window.setTimeout(type, 50);
               isTyping = true;
               typingTimeout.current = window.setTimeout(type, 500);
            }
         }
      };

      type();

      return () => {
         if (typingTimeout.current !== null) {
            clearTimeout(typingTimeout.current);
         }
      };
   }, []);

   // Debounced fetchSuggestions function
   const fetchSuggestions = useRef(
      debounce(async (input: string) => {
         if (input.length > 1) {
            setIsLoading(true);
            try {
               const response = await fetch(
                  `/api/courses/search?query=${input}`
               );
               const data: Suggestion[] = await response.json();
               setSuggestions(data);
            } catch (error) {
               console.error("Error fetching suggestions:", error);
               setSuggestions([]);
            } finally {
               setIsLoading(false);
            }
         } else {
            setSuggestions([]);
         }
      }, 100)
   ).current;

   useEffect(() => {
      return () => {
         fetchSuggestions.cancel();
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   const handleSearch = (suggestion: string) => {
      setSearchInput(suggestion);
      setSuggestions([]);

      if (!(course === suggestion || professor === suggestion)) {
         resetState?.();
      }

      const isProfessor = suggestions.find(
         (s) => s.suggestion === suggestion && s.type === "professor"
      );

      if (isProfessor) {
         router.push(`/results?professor=${encodeURIComponent(suggestion)}`);
      } else {
         router.push(`/results?course=${encodeURIComponent(suggestion)}`);
      }
   };

   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.target.value;
      setSearchInput(input);
      fetchSuggestions(input);
   };

   return (
      <div className="relative w-full max-w-lg mx-auto">
         <div className="relative">
            <input
               type="text"
               placeholder={placeholderText}
               value={searchInput}
               onChange={handleInputChange}
               onKeyDown={(e) =>
                  e.key === "Enter" &&
                  handleSearch(suggestions[0]?.suggestion || searchInput)
               }
               className="w-full p-3 border border-gray-500 rounded-xl shadow-sm focus:outline-none focus:border-blue-500 bg-white bg-opacity-10"
            />
            <FaSearch
               onClick={() =>
                  handleSearch(suggestions[0]?.suggestion || searchInput)
               }
               className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-300 w-4 h-4"
            />
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
