"use client";

import axios from "axios";
import { SearchIcon, Loader2, XIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";

function TodosHead({ fetchTodosByName }) {
  const [isOpen, setIsOpen] = useState(() => false);
  const [isLoading, setIsLoading] = useState(() => false);
  const [searchQuery, setSearchQuery] = useState(() => "");
  const [showDropdown, setShowDropdown] = useState(() => false);
  const [searchResults, setSearchResults] = useState(() => []);
  const [creating, setCreating] = useState(() => false);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);
  const debounceRef = useRef(null);
  const router = useRouter();

  const handleCreateTodo = async () => {
    setCreating(true);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/todos`,
        {}
      );
      console.log(res.data);
      toast.success(res.data?.message || "Todo created successfully");
      router.refresh();
    } catch (error) {
      console.error("Error creating todo:", error);
      toast.error("Error", {
        description:
          error?.response?.data?.message ||
          error.message ||
          "Error creating todo",
      });
    } finally {
      setCreating(false);
    }
  };

  const handleSearchClick = () => {
    setIsOpen((prev) => {
      const isOpening = !prev;

      if (!isOpening) {
        if (searchQuery.trim() !== "") {
          fetchTodosByName(searchQuery);
          return true;
        } else {
          setSearchQuery("");
          setShowDropdown(false);
          return false;
        }
      }

      setTimeout(() => inputRef.current?.focus(), 0);
      return true;
    });
  };

  const fetchSuggestions = async (query) => {
    setIsLoading(true);
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/todos/search?query=${query}`
      );
      setSearchResults(res.data?.data || []);
      setShowDropdown(true);
    } catch (error) {
      console.error("Error fetching search results:", error);
      setSearchResults([]);
      setShowDropdown(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      if (value) {
        fetchSuggestions(value);
      } else {
        setIsLoading(false);
        setShowDropdown(false);
      }
    }, 500);
  };

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const handleSelectResult = (result) => {
    setSearchQuery(result.title);
    setShowDropdown(false);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowDropdown(false);
    setIsLoading(false);
    router.refresh();
    setIsOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !inputRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full flex justify-between items-center">
      {!isOpen && (
        <button
          onClick={handleCreateTodo}
          className="bg-black text-white text-sm 3xl:text-base hover:bg-black/80 p-3 rounded-md flex items-center gap-2 cursor-pointer transition duration-300 ease-in-out"
          disabled={creating}
          aria-label="Create new todo"
          title="Create new todo"
        >
          {creating ? (
            <>
              <Loader2 className="text-white animate-spin w-5 h-5" />
              <span className="text-white">Creating...</span>
            </>
          ) : (
            <>
              <div className="relative w-5 h-5">
                <Image
                  src="/new.svg"
                  alt="New Icon"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <span className="text-white">TODO</span>
            </>
          )}
        </button>
      )}
      {isOpen && (
        <div className="relative flex-1 mx-4">
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              name="search"
              className="bg-white p-3 w-full shadow rounded border-none outline-none pr-10 focus:ring-1 focus:ring-gray-100 transition duration-300 ease-in-out"
              placeholder="Search"
              value={searchQuery}
              onChange={handleSearch}
            />
            <div
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
              aria-label="Clear search"
              title="Clear search"
              role="button"
            >
              <XIcon />
            </div>
          </div>

          {showDropdown && searchResults.length > 0 && (
            <div
              ref={dropdownRef}
              className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md max-h-60 overflow-auto"
            >
              <ul className="py-1">
                {searchResults.map((result) => (
                  <li
                    key={result._id}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleSelectResult(result)}
                  >
                    {result.title}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {showDropdown &&
            searchQuery &&
            searchResults.length === 0 &&
            !isLoading && (
              <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md">
                <p className="px-4 py-3 text-gray-500 text-sm">
                  No results found
                </p>
              </div>
            )}
        </div>
      )}
      <button
        onClick={handleSearchClick}
        className="bg-white hover:bg-gray-200 p-3 rounded-md shadow cursor-pointer transition duration-300 ease-in-out"
        aria-label="Search"
        title="Search"
      >
        {isLoading ? (
          <Loader2 className="text-gray-400 animate-spin" />
        ) : (
          <SearchIcon />
        )}
      </button>
    </div>
  );
}

export default TodosHead;
