"use client";

import { useState } from "react";
import { DESTINATIONS, HOME_AIRPORT, todayLocalIso, addDaysLocalIso } from "@travel-app/shared";
import { Field, TextInput, Select } from "../ui/Field";
import { Button } from "../ui/Button";

export interface PackageFormState {
  originCode: string;
  destinationCode: string; // "" = all popular destinations
  departureDate: string;
  returnDate: string;
  adults: number;
  maxBudget: string;
}

const today = todayLocalIso();
const inAWeek = addDaysLocalIso(7);

export function PackageSearchForm({ onSearch, loading }: { onSearch: (state: PackageFormState) => void; loading: boolean }) {
  const [state, setState] = useState<PackageFormState>({
    originCode: HOME_AIRPORT,
    destinationCode: "",
    departureDate: today,
    returnDate: inAWeek,
    adults: 2,
    maxBudget: "",
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSearch(state);
      }}
      className="bg-white rounded-2xl border border-brand-100 shadow-sm p-4 md:p-6 grid grid-cols-1 md:grid-cols-6 gap-3"
    >
      <div className="md:col-span-1">
        <Field label="יעד">
          <Select value={state.destinationCode} onChange={(e) => setState({ ...state, destinationCode: e.target.value })}>
            <option value="">כל היעדים הפופולריים</option>
            {DESTINATIONS.map((d) => (
              <option key={d.id} value={d.airportCode}>
                {d.city}
              </option>
            ))}
          </Select>
        </Field>
      </div>
      <div className="md:col-span-1">
        <Field label="תאריך יציאה">
          <TextInput
            type="date"
            min={today}
            value={state.departureDate}
            onChange={(e) => setState({ ...state, departureDate: e.target.value })}
            required
          />
        </Field>
      </div>
      <div className="md:col-span-1">
        <Field label="תאריך חזרה">
          <TextInput
            type="date"
            min={state.departureDate}
            value={state.returnDate}
            onChange={(e) => setState({ ...state, returnDate: e.target.value })}
            required
          />
        </Field>
      </div>
      <div className="md:col-span-1">
        <Field label="נוסעים">
          <TextInput
            type="number"
            min={1}
            max={9}
            value={state.adults}
            onChange={(e) => setState({ ...state, adults: Number(e.target.value) })}
          />
        </Field>
      </div>
      <div className="md:col-span-1">
        <Field label="תקציב מקסימלי לאדם (אופציונלי)">
          <TextInput
            type="number"
            min={0}
            placeholder="ללא הגבלה"
            value={state.maxBudget}
            onChange={(e) => setState({ ...state, maxBudget: e.target.value })}
          />
        </Field>
      </div>
      <div className="md:col-span-1 flex items-end justify-end">
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "מחפש..." : "חיפוש חבילות"}
        </Button>
      </div>
    </form>
  );
}
