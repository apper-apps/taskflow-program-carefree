import { useState } from "react";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const SearchBar = ({ value, onChange, placeholder = "Search tasks...", onClear }) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleClear = () => {
    onChange("");
    if (onClear) onClear();
  };

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <ApperIcon name="Search" className="h-4 w-4 text-gray-400" />
      </div>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-10 pr-10"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      {value && (
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClear}
            className="h-6 w-6 rounded-full"
          >
            <ApperIcon name="X" className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default SearchBar;