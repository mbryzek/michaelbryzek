-- Seed of the September 2026 trip from the original itinerary export.
--
-- Everything here is taken from that export as written. Where the export was
-- silent — flight times, the four transfers, the route to Warsaw — the column
-- is NULL and a row exists in `questions` instead. Nothing is inferred to fill
-- a gap: an invented departure time is worse than a visible blank.

INSERT INTO days (trip_slug, date, place, country, summary, lodging) VALUES
  ('europe-26','2026-09-09','Newark','United States','Depart for Milan','Overnight flight'),
  ('europe-26','2026-09-10','Varenna, Lake Como','Italy','Land in Milan, travel up to the lake','Varenna'),
  ('europe-26','2026-09-11','Varenna, Lake Como','Italy','First full day on Lake Como','Varenna'),
  ('europe-26','2026-09-12','Varenna, Lake Como','Italy','Lake villages and ferries','Varenna'),
  ('europe-26','2026-09-13','Milan to Praiano','Italy','Italo south to Naples, then the coast road','Praiano'),
  ('europe-26','2026-09-14','Praiano, Amalfi Coast','Italy','Settle in — dinner booked','Praiano'),
  ('europe-26','2026-09-15','Amalfi Coast','Italy','Out along the coast','Praiano'),
  ('europe-26','2026-09-16','Praiano, Amalfi Coast','Italy','Last day on the Amalfi Coast','Praiano'),
  ('europe-26','2026-09-17','Chania, Crete','Greece','Naples to Crete','Chania'),
  ('europe-26','2026-09-18','Chania, Crete','Greece','The old town and the harbour','Chania'),
  ('europe-26','2026-09-19','Crete','Greece','Beach or an excursion further out','Chania'),
  ('europe-26','2026-09-20','Chania, Crete','Greece','Last day on Crete','Chania'),
  ('europe-26','2026-09-21','Chania to Paros','Greece','Crete to Athens, then on to the island','Naousa, Paros'),
  ('europe-26','2026-09-22','Naousa, Paros','Greece','The harbour town','Naousa, Paros'),
  ('europe-26','2026-09-23','Paros','Greece','Island day','Naousa, Paros'),
  ('europe-26','2026-09-24','Paros','Greece','Inland villages','Naousa, Paros'),
  ('europe-26','2026-09-25','Paros','Greece','Open day','Naousa, Paros'),
  ('europe-26','2026-09-26','Paros','Greece','Sailing, beach, or a village tour','Naousa, Paros'),
  ('europe-26','2026-09-27','Paros','Greece','Open day','Naousa, Paros'),
  ('europe-26','2026-09-28','Paros','Greece','Open day','Naousa, Paros'),
  ('europe-26','2026-09-29','Paros','Greece','Open day','Naousa, Paros'),
  ('europe-26','2026-09-30','Paros','Greece','Last day in Greece','Naousa, Paros'),
  ('europe-26','2026-10-01','Porto','Portugal','Warsaw to Porto','Porto'),
  ('europe-26','2026-10-02','Porto','Portugal','Central Porto','Porto'),
  ('europe-26','2026-10-03','Porto','Portugal','Final morning','—');

-- Confirmed reservations. `confirmed = 1` means booked and paid for; the app
-- renders these differently from anything aspirational.
INSERT INTO items (trip_slug, date, kind, title, detail, cost, cost_note, confirmed, sort_order) VALUES
  ('europe-26','2026-09-09','flight','Newark to Milan Malpensa','EWR to MXP, arrives the morning of the 10th','$4,276.00',NULL,1,10),
  ('europe-26','2026-09-13','train','Milan to Naples','Italo. Departure and arrival times not yet recorded.',NULL,NULL,1,10),
  ('europe-26','2026-09-14','dining','Dinner in Praiano','19:30 – 22:00',NULL,NULL,1,20),
  ('europe-26','2026-09-17','flight','Naples to Chania','NAP to CHQ','$282.25',NULL,1,10),
  ('europe-26','2026-09-21','flight','Chania to Athens','CHQ to ATH. Onward travel to Paros not yet recorded.',NULL,'no cost recorded',1,10),
  ('europe-26','2026-10-01','flight','Warsaw to Porto','WAW to OPO','$312.70','one of two identical bookings — see open questions',1,10);

INSERT INTO items (trip_slug, date, kind, title, detail, cost, cost_note, confirmed, sort_order) VALUES
  ('europe-26','2026-09-10','lodging','Varenna','Contrada della Filanda 2, 23829 Varenna LC — four nights','€2,774.00','amount recorded; mapping to this stay unverified',1,1),
  ('europe-26','2026-09-13','lodging','Praiano','Via Campo 5, 84010 Praiano SA — four nights','€4,076.00','amount recorded; mapping to this stay unverified',1,1),
  ('europe-26','2026-09-17','lodging','Chania','5 Strati Pantelaki Street, Chania 731 00 — four nights','€5,572.00','amount recorded; mapping to this stay unverified',1,1),
  ('europe-26','2026-09-21','lodging','Naousa, Paros','Naousa 844 01 — ten nights','€3,437.96','amount recorded; mapping to this stay unverified',1,1),
  ('europe-26','2026-10-01','lodging','Porto','Rua de Alexandre Herculano 311, 4000-053 Porto — two nights',NULL,'no cost recorded',1,1);

-- Everything the export left unresolved, as a working checklist.
INSERT INTO questions (trip_slug, question, date, sort_order) VALUES
  ('europe-26','How do we get from Paros to Warsaw before the October 1 flight? Nothing is booked for this.','2026-09-30',1),
  ('europe-26','Two identical Warsaw to Porto bookings on October 1 — is one a duplicate to cancel?','2026-10-01',2),
  ('europe-26','What are the Italo train times on September 13?','2026-09-13',3),
  ('europe-26','How do we get from Milan Malpensa to Varenna?','2026-09-10',4),
  ('europe-26','How do we get from Naples to Praiano?','2026-09-13',5),
  ('europe-26','How do we get from Chania airport to the hotel?','2026-09-17',6),
  ('europe-26','How do we get from Athens to Paros — ferry or flight?','2026-09-21',7),
  ('europe-26','What happens after October 3? No departure is recorded.','2026-10-03',8),
  ('europe-26','Confirm departure and arrival times for all four flights.',NULL,9),
  ('europe-26','Are the recorded lodging amounts full totals or deposits, and which stay does each belong to?',NULL,10),
  ('europe-26','The Chania to Athens flight has no recorded cost.','2026-09-21',11);
