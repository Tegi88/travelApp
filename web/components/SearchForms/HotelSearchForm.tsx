"use client";

import { useState } from "react";
import { ALL_DESTINATIONS, todayLocalIso, addDaysLocalIso } from "@travel-app/shared";
import { Field, TextInput, Select } from "../ui/Field";
import { Button } from "../ui/Button";

export interface HotelFormState {
  destinationId: string;
  checkInDate: string;
  checkOutDate: string;
  adults: number;
  rooms: number;
}

const today = todayLocalIso();
const inAWeek = addDaysLocalIso(7);

export function HotelSearchForm({ onSearch, loading }: { onSearch: (state: HotelFormState) => void; loading: boolean }) {
  const [state, setState] = useState<HotelFormState>({
    destinationId: ALL_DESTINATIONS[0].id,
    checkInDate: today,
    checkOutDate: inAWeek,
    adults: 2,
    rooms: 1,
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSearch(state);
      }}
      className="bg-white rounded-2xl border border-brand-100 shadow-sm p-4 md:p-6 grid grid-cols-1 md:grid-cols-5 gap-3"
    >
      <div className="md:col-span-1">
        <Field label="יעד">
          <Select value={state.destinationId} onChange={(e) => setState({ ...state, destinationId: e.target.value })}>
            {ALL_DESTINATIONS.map((d) => (
              <option key={d.id} value={d.id}>
                {d.city}, {d.country}
              </option>
            ))}
          </Select>
        </Field>
      </div>
      <div className="md:col-span-1">
        <Field label="צ'ק-אין">
          <TextInput
            type="date"
            min={today}
            value={state.checkInDate}
            onChange={(e) => setState({ ...state, checkInDate: e.target.value })}
            required
          />
        </Field>
      </div>
      <div className="md:col-span-1">
        <Field label="צ'ק-אאוט">
          <TextInput
            type="date"
            min={state.checkInDate}
            value={state.checkOutDate}
            onChange={(e) => setState({ ...state, checkOutDate: e.target.value })}
            required
          />
        </Field>
      </div>
      <div className="md:col-span-1">
        <Field label="אורחים">
          <TextInput
            type="number"
            min={1}
            max={12}
            value={state.adults}
            onChange={(e) => setState({ ...state, adults: Number(e.target.value) })}
          />
        </Field>
      </div>
      <div className="md:col-span-1">
        <Field label="חדרים">
          <TextInput
            type="number"
            min={1}
            max={6}
            value={state.rooms}
            onChange={(e) => setState({ ...state, rooms: Number(e.target.value) })}
          />
        </Field>
      </div>
      <div className="md:col-span-5 flex justify-end">
        <Button type="submit" disabled={loading}>
          {loading ? "מחפש..." : "חיפוש מלונות"}
        </Button>
      </div>
    </form>
  );
}
