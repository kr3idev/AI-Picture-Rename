import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Languages } from "@/type/Languages";
interface TargetLanguageSelectProps {
  targetLanguage: string;
  setTargetLanguage: (language: string) => void;
}

export default function TargetLanguageSelect({
  targetLanguage,
  setTargetLanguage,
}: TargetLanguageSelectProps) {
  function handleTargetLanguageChange(language: string) {
    setTargetLanguage(language);
    localStorage.setItem("targetLanguage", language);
  }

  return (
    <Select
      onValueChange={(language) => handleTargetLanguageChange(language)}
      defaultValue={targetLanguage}
    >
      <SelectTrigger className="w-[100px]">
        <SelectValue placeholder="Select a timezone" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {Languages.map((language) => (
            <SelectItem key={language} value={language}>
              {language}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
