"use client";

import { useState } from "react";
import { DESTINATIONS, HOME_AIRPORT, FlightSearchParams, todayLocalIso } from "@travel-app/shared";
import { Field, TextInput, Select } from "../ui/Field";
import { Button } from "../ui/Button";

export interface FlightFormState {
  originCode: string;
  destinationCode: string;
  departureDate: string;
  returnDate: string;
  adults: number;
  cabinClass: FlightSearchParams["cabinClass"];
}

const today = todayLocalIso();

export function FlightSearchForm({ onSearch, loading }: { onSearch: (state: FlightFormState) => void; loading: boolean }) {
  const [state, setState] = useState<FlightFormState>({
    originCode: HOME_AIRPORT,
    destinationCode: DESTINATIONS[0].airportCode,
    departureDate: today,
    returnDate: "",
    adults: 1,
    cabinClass: "ECONOMY",
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
        <Field label="מוצא">
          <Select value={state.originCode} onChange={(e) => setState({ ...state, originCode: e.target.value })}>
            <option value={HOME_AIRPORT}>תל אביב (TLV)</option>
          </Select>
        </Field>
      </div>
      <div className="md:col-span-1">
        <Field label="יעד">
          <Select
            value={state.destinationCode}
            onChange={(e) => setState({ ...state, destinationCode: e.target.value })}
          >
            {DESTINATIONS.map((d) => (
              <option key={d.id} value={d.airportCode}>
                {d.city} ({d.airportCode})
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
        <Field label="תאריך חזרה (אופציונלי)">
          <TextInput
            type="date"
            min={state.departureDate}
            value={state.returnDate}
            onChange={(e) => setState({ ...state, returnDate: e.target.value })}
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
        <Field label="מחלקה">
          <Select value={state.cabinClass} onChange={(e) => setState({ ...state, cabinClass: e.target.value as FlightSearchParams["cabinClass"] })}>
            <option value="ECONOMY">אקונומי</option>
            <option value="PREMIUM_ECONOMY">אקונומי פרימיום</option>
            <option value="BUSINESS">ביזנס</option>
            <option value="FIRST">ראשונה</option>
          </Select>
        </Field>
      </div>
      <div className="md:col-span-6 flex justify-end">
        <Button type="submit" disabled={loading}>
          {loading ? "מחפש..." : "חיפוש טיסות"}
        </Button>
      </div>
    </form>
  );
}
