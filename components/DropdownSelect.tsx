"use client";

import { useEffect, useMemo, useState } from "react";
import { type LucideIcon } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchNamedCollection } from "@/lib/api";
import { useOrderStore } from "@/lib/store";
import type { NamedEntity } from "@/types";

interface DropdownSelectProps {
  label: string;
  endpoint: string;
  placeholder: string;
  icon: LucideIcon;
  value: NamedEntity | null;
  onChange: (option: NamedEntity | null) => void;
}

export default function DropdownSelect({
  label,
  endpoint,
  placeholder,
  icon: Icon,
  value,
  onChange,
}: DropdownSelectProps) {
  const token = useOrderStore((state) => state.token);
  const [options, setOptions] = useState<NamedEntity[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      return;
    }

    const request = async () => {
      try {
        setLoading(true);
        const data = await fetchNamedCollection(endpoint, token);
        setOptions(data);
      } catch (error: any) {
        toast.error(error.message || `Unable to load ${label.toLowerCase()}.`);
      } finally {
        setLoading(false);
      }
    };

    request();
  }, [endpoint, label, token]);

  const selectedValue = value?.id ?? "";
  const summary = useMemo(() => {
    if (loading) {
      return "Loading options...";
    }

    if (value?.name) {
      return value.name;
    }

    return placeholder;
  }, [loading, placeholder, value]);

  return (
    <Card className="crm-card">
      <CardContent className="space-y-3 p-4 sm:p-5">
        <Label className="crm-label">
          <Icon className="h-4 w-4" />
          {label}
        </Label>

        <Select
          value={selectedValue}
          onValueChange={(nextValue) => {
            const nextOption = options.find((option) => option.id === nextValue) ?? null;
            onChange(nextOption);
          }}
        >
          <SelectTrigger className="crm-input h-12 border-slate-200 bg-slate-50 px-4">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent className="rounded-2xl border border-slate-200 bg-white p-1 shadow-[0_22px_50px_-30px_rgba(15,23,42,0.35)]">
            {options.map((option) => (
              <SelectItem
                key={option.id}
                value={option.id}
                className="rounded-xl py-3 text-sm data-[highlighted]:bg-slate-50 data-[highlighted]:text-slate-950"
              >
                {option.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <p className="text-sm text-slate-500">{summary}</p>
      </CardContent>
    </Card>
  );
}
