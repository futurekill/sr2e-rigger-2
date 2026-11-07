# Rigger 2 Power Plant Table, book p.167-169 (PDF p.176-178), transcribed 2026-11-07 from 200-dpi renders.
# One line per printed row, in the table's order. Columns:
#   label | chassis keys (design-chassis.json) | speed start | speed max | accel start | accel max |
#   load start | load max | sig | economy start | economy max | idle start | idle max | fuel | DP
# "40/120" = stall/speed (aircraft); "5 x B" = a Body formula (p.169 note); NA = not applicable.
import json, re, sys
BIKES = "scooter racingCycle offRoadBike chopper atv"
# Body-0 crawlers use the electric "Body 0 Drone" row: the ×Body rows give them a max Load of 0 (below the start).
DRONES_GROUND = "crawlerSmall crawlerLarge rpv"
WALKERS = "walkerMicro walkerSmall walkerLarge anthroform"
SKIMMERS = "skimmerSmall skimmerLarge"
SECTIONS = {
 "electric": ("p.167", "km/PF", "PF", """
Bikes (all)|BIKES|60|90|3|6|15|40|5|0.5|2|||75|5
Cars: Subcompact, Sand Buggy, Sedan and Limo|subcompact sandBuggy sedan limousine|75|100|4|9|40|160|5|0.5|2.5|||150|10
Cars: Pickup, Van and RV|pickup van rv|40|80|2|5|350|1250|5|0.25|1|||200|15
Body 0 Drone|crawlerMicro walkerMicro rotaryUavS|1|5|NA|NA|0|0|16|0.1|0.5|||1|10
Tracked Drone|DRONES_GROUND|10|40|2|4|5 x B|500 x B|9 - B|0.75|1.5|2 min/PF|10 min/PF|10 + (30 x B)|5 x B
Wheeled Drone|DRONES_GROUND|10|50|2|5|5 x B|400 x B|9 - B|1|2|2 min/PF|10 min/PF|10 + (30 x B)|5 x B
Hovercraft: Skimmer|SKIMMERS|90|180|4|10|5 x B|300 x B|8 - B|0.4|1.6|1 min/PF|5 min/PF|50|5 x B
Motorboats: Skiff and Water Scooter|skiff waterScooter|30|60|3|6|15|40|5|1|5|||75|20
Motorboats: Minisub|minisub|5|15|2|5|40|160|8|1|5|||250|10
Fixed Wing: Ultralight|ultralight|15/45|15/75|3|6|0|200|9|0.25|1|||50|100
Fixed Wing UAV, Micro|fixedUavS|40/60|40/125|5|8|2|8|10|5|10|||40|10
Rotary Wing UAV, Micro|rotaryUavS|10|25|3|8|0|0|16|5 m/PF|10 m/PF|1 min/PF|5 min/PF|10|10
Rotary Wing UAV, Small and Medium|rotaryUavS rotaryUavM|35|90|3|12|5|75|8 - B|1|2.5|2 min/PF|5 min/PF|150|5 x B
Special: Zeppelin|zeppelin|40|125|1|9|1000|4000|4|0.25|1|||1000|500
Special: Mini-blimp|miniBlimp|40|75|1|5|2|75|9|5|10|2 hrs/PF|5 hrs/PF|10|10
Special: Walker|WALKERS|2|15|1|1|5|15|8|0.5|1|2 min/PF|10 min/PF|40|10
"""),
 "methane": ("p.167-168", "km/bar", "bars", """
Bikes|BIKES|40|90|4|9|60|120|4|1.25|2|||300|5
Cars: Subcompact and Sand Buggy|subcompact sandBuggy|90|100|6|10|40|160|4|1.25|2.5|||450|20
Cars: Sedan and Limousine|sedan limousine|100|140|6|10|60|200|4|1|2.25|||500|20
Cars: Pickup, Van and RV|pickup van rv|80|120|2|5|350|1600|3|0.5|1.5|||1000|20
Tracked Drone|DRONES_GROUND|20|35|2|6|10 x B|500 x B|8 - B|0.75|1.25|1 hr/bar|3 hrs/bar|150|20
Wheeled Drone|DRONES_GROUND|30|70|2|7|10 x B|400 x B|8 - B|1|2|1 hr/bar|3 hrs/bar|150|20
Hovercraft, Small|hovercraftSmall|100|240|2|9|400|1400|3|0.25|1|||2500|20
Hovercraft: Skimmer|SKIMMERS|90|180|5|20|10 x B|300 x B|7 - B|0.25|1|12 min/bar|30 min/bar|2500|10 x B
Motorboats: Skiff and Water Scooter|skiff waterScooter|20|50|3|10|50|250|4|1|2.25|||250|20
Motorboats: Sport Cruiser and Yacht|sportCruiser yacht|20|40|3|10|300|1000|4|0.75|1.5|||1000|20
Motorboats: Minisub|minisub|5|20|1|7|250|800|7|0.25|1|||2000|20
Rotary Wing UAV, Small|rotaryUavS|50|100|3|7|10|500|6|0.05|0.25|12 min/bar|30 min/bar|400|20
Fixed Wing UAV, Micro|fixedUavS|40/80|40/150|11|14|10|500|5|0.75|1.25|||400|20
Special: Walkers|WALKERS|3|9|1|1|5|15|8 - B|0.5|1|1 hr/bar|3 hrs/bar|150|20
"""),
 "gasoline": ("p.168", "km/liter", "liters", """
Bikes: Racing Bike|racingCycle|120|240|10|18|50|100|2|8|16|||15|5
Bikes: All Others|scooter offRoadBike chopper atv|60|150|4|10|80|140|2|10|14|||20|5
Cars: Subcompact and Sand Buggy|subcompact sandBuggy|90|100|6|10|40|160|2|8|12|||40|25
Cars: Sedan|sedan|100|160|8|14|60|300|2|8|14|||60|25
Cars: Limousine|limousine|100|160|8|14|60|400|2|8|14|||60|50
Cars: Sports Car|sportsCar|160|270|10|18|40|200|2|6|10|||60|65
Cars: Pickup|pickup|100|140|7|12|250|1600|2|6|10|||80|30
Cars: Van and RV|van rv|80|120|5|8|350|2500|2|5|9|||95|40
Tracked Drone|DRONES_GROUND|25|55|3|9|10|550 x B|6 - B|1.5|5|1 hr/liter|1.5 hrs/liter|5|25
Wheeled Drone|DRONES_GROUND|35|100|3|12|10|450 x B|6 - B|4|8|1 hr/liter|1.5 hrs/liter|5|25
Hovercraft, Small|hovercraftSmall|90|130|5|10|600|1500|2|0.5|3|||400|50
Hovercraft: Skimmer|SKIMMERS|90|180|5|20|10 x B|300 x B|7 - B|0.5|1|25 min/liter|45 min/liter|25|20 x B
Motorboats: Skiff and Water Scooter|skiff waterScooter|45|90|6|10|50|250|3|7|10|||20|25
Motorboats: Speedboat|speedboat|75|240|10|18|40|400|2|3|6|||100|30
Motorboats: Sport Cruiser|sportCruiser|30|100|5|9|350|1500|3|4|8|||200|35
Motorboats: Yacht|yacht|30|100|5|9|350|2500|3|4|8|||200|35
Motorboats: Minisub|minisub|5|30|2|5|250|1000|6|1|4|||300|25
Rotary Wing UAV, Small|rotaryUavS|40|90|4|8|4|10|4|0.25|0.4|10 min/liter|15 min/liter|60|25
Fixed Wing UAV, Micro|fixedUavS|40/90|40/200|7|10|4|10|4|0.5|0.75|||60|25
Special: Walkers|WALKERS|5|12|1|1|6|18|6 - B|0.25|1|1 hr/liter|2.5 hrs/liter|5|25
"""),
 "diesel": ("p.168", "km/liter", "liters", """
Cars: Limousine|limousine|80|140|8|12|180|800|2|6|10|||60|65
Cars: Pickup|pickup|120|200|7|12|1000|2000|2|5|9|||80|35
Cars: Van and RV|van rv|80|150|4|9|1000|3000|2|4|8|||95|35
Cars: Medium Transport|mediumTransport|65|130|3|6|2000|5000|2|4|8|||250|35
Cars: Heavy Transport|heavyTransport|60|120|3|5|6000|12000|2|3|6|||500|35
Cars: Tractors|tractor|60|120|3|4|7500|18000|2|3|6|||750|35
Tracked Drones|DRONES_GROUND|25|50|3|7|10|750 x B|6 - B|1|4|1 hr/ltr|1.5 hrs/ltr|5|25 + (10 x B)
Wheeled Drones|DRONES_GROUND|35|90|3|10|10|600 x B|6 - B|2|6|1 hr/ltr|1.5 hrs/ltr|5|25 + (10 x B)
Hovercraft, Medium|hovercraftMedium|90|150|5|10|750|2500|2|0.5|2.5|||400|75
Hovercraft, Large|hovercraftLarge|90|150|5|10|1000|5000|2|0.5|2.5|||400|75
Hovercraft: Skimmer|SKIMMERS|90|180|5|20|10 x B|500 x B|7 - B|0.25|1|20 min/ltr|30 min/ltr|25|20 + (10 x B)
Motorboats: Sport Cruiser|sportCruiser|30|100|4|6|500|2500|2|2|6|||200|35
Motorboats: Yacht|yacht|30|100|4|6|600|3500|2|2|6|||200|40
Motorboats: Minisub|minisub|10|70|2|4|400|2000|6|1|4|||300|35
Special: Walkers|WALKERS|5|12|1|1|10|30|4|0.1|0.75|||5|35
Armored Personnel Carriers|apcTracked apcWheeled|40|70|5|8|3|6|2|2|4|||800|35
"""),
 "jetPropeller": ("p.169", "km/liter", "liters", """
Fixed Wing: Ultralight|ultralight|40/120|40/250|17|20|15|150|6|1|3|||60|20
Fixed Wing: Single Engine|singleEngine|60/130|60/450|20|25|175|750|4|1|3|||250|50
Fixed Wing: Twin Engine|twinEngine|135/280|135/500|20|28|350|2500|4|1|3|||500|75
Fixed Wing: Airliner|airliner|135/320|135/500|22|35|5000|15000|3|0.75|1.5|||5000|500
Fixed Wing UAV|fixedUavS fixedUavM fixedUavL|20 x B/45 x B|20 x B/175 x B|30|75|10|225|6|1|3|||60|40
Rotor: Tilt-wing|tiltWing|280|500|10|20|350|2500|4|0.6|1|||750|75
Tilt-wing UAV, Medium and Large|tiltWingUavM tiltWingUavL|45 x B|175 x B|6|18|10|450||0.6|1|5 min/liter|15 min/liter|60|50
Special: Zeppelin|zeppelin|70|250|8|26|1000|4000|2|1|3|||2000|300
"""),
 "jetTurbine": ("p.169", "km/liter", "liters", """
Rotor: Autogyro|autogyro|60|200|10|20|15|155|4|0.25|0.4|||250|25
Rotor: Utility Helicopter, standard|utilityHelicopter|120|350|10|25|850|3600|3|0.2|0.35|||1000|50
Rotor: Utility Helicopter, supercharged|utilityHelicopter|360|500|15|40|400|900|2|0.1|0.3|||1500|100
Rotor: Cargo Helicopter|cargoHelicopter|120|350|10|25|850|12000|3|0.2|0.35|||1000|150
Rotor: Attack Helicopter|attackHelicopter|250|350|20|35|1500|5000|4|0.1|0.3|||3000|1500
Rotary Wing UAV, all|rotaryUavS rotaryUavM rotaryUavL|60|200|6|18|10 x B|450 x B|6 - B|0.25|0.4|5 min/liter|15 min/liter|120|30 + (10 x B)
Fixed Wing: Single Engine|singleEngine|60/320|60/400|20|35|250|2000|3|0.5|0.75|||750|100
Fixed Wing: Twin Engine|twinEngine|135/500|135/800|30|42|500|5000|3|0.5|0.75|||1500|150
Fixed Wing: Airliner|airliner|150/600|150/1000|35|60|10000|75000|2|0.4|0.6|||5000|1000
Fixed Wing: Jet Fighter|jetFighter|150/2000|150/5000|80|250|7500|12500|5|0.1|0.3|||7500|2000
Fixed Wing UAV, Medium, Large|fixedUavM fixedUavL|20 x B/100 x B|20 x B/60 x B^3|10 + (10 x B)|30 + (60 x B^2)|10|500 x B^2|6|0.5|0.75|||120|80
Vector: Thunderbird|thunderbird|150/400|150/750|25|60|10000|20000|3|0.05|0.3|||7500|2500
Vector: Jump-jet Fighter|jumpJet|700|2000|50|150|2000|9600|5|0.1|0.3|||2500|2000
Vector Thrust UAV, Small, Large|vectorUavS vectorUavL|60 x B|200 x B|10|25|10|500|6 - B|0.25|0.4|5 min/liter|15 min/liter|120|30 + (15 x B)
Special: Zeppelin|zeppelin|120|400|12|26|1250|4500|1|0.5|0.75|||2000|450
"""),
 "sail": ("p.169", "", "", """
Sailboats: Skiff|skiff|30|60|3|7|150|750|6|NA|NA|||NA|10
Sailboats: Sport Cruiser|sportCruiser|30|50|3|6|250|1000|6|NA|NA|||NA|10
Sailboats: Yacht|yacht|30|45|3|6|350|2500|6|NA|NA|||NA|10
"""),
}
NOTES = {
 ("diesel", "Armored Personnel Carriers"): "Load prints as 3 / 6 (kg) - almost certainly 3,000 / 6,000 with the thousands lost; kept as printed, flagged for the user.",
 ("jetPropeller", "Tilt-wing UAV, Medium and Large"): "Signature cell is blank in print.",
 ("electric", "Fixed Wing UAV, Micro"): "The book's UAVs come in small/medium/large (p.110); 'Micro' is mapped to the Small chassis.",
 ("electric", "Rotary Wing UAV, Micro"): "Mapped to the Small chassis (palm-sized, p.110). Economy is in meters/PF.",
 ("methane", "Fixed Wing UAV, Micro"): "Mapped to the Small chassis (p.110).",
 ("gasoline", "Fixed Wing UAV, Micro"): "Mapped to the Small chassis (p.110).",
 ("electric", "Body 0 Drone"): "Every Body-0 drone chassis (Crawler Micro, Walker Micro, Rotary Wing UAV (S)).",
}
def cellv(v):
    v = v.strip()
    if v in ("", "NA"): return None
    if re.fullmatch(r"-?\d+(\.\d+)?", v): return float(v) if "." in v else int(v)
    return v
def speed(start, mx):
    out = {}
    if "/" in start and not start.startswith("("):
        s0, s1 = start.split("/", 1); m0, m1 = mx.split("/", 1)
        out = {"stall": cellv(s0), "start": cellv(s1), "max": cellv(m1)}
    else:
        out = {"start": cellv(start), "max": cellv(mx)}
    return out
rows = []
for engine, (page, ecoUnit, fuelUnit, block) in SECTIONS.items():
    for line in block.strip().splitlines():
        f = line.split("|")
        assert len(f) == 15, (engine, line, len(f))
        label, ch = f[0], f[1]
        for k, v in (("BIKES", BIKES), ("DRONES_GROUND", DRONES_GROUND), ("WALKERS", WALKERS), ("SKIMMERS", SKIMMERS)):
            if ch == k: ch = v
        eco = {"start": cellv(f[9]), "max": cellv(f[10]), "unit": ecoUnit}
        if " m/PF" in f[9]:
            eco = {"start": cellv(f[9].replace(" m/PF", "")), "max": cellv(f[10].replace(" m/PF", "")), "unit": "m/PF"}
        if f[11] or f[12]: eco["idle"] = {"start": f[11], "max": f[12]}
        key = engine + "-" + re.sub(r"[^a-z0-9]+", "-", label.lower()).strip("-")
        row = {"key": key, "label": label, "engine": engine, "chassis": ch.split(),
               "speed": speed(f[2], f[3]), "acceleration": None if f[4] == "NA" else {"start": cellv(f[4]), "max": cellv(f[5])},
               "load": {"start": cellv(f[6]), "max": cellv(f[7])}, "signature": cellv(f[8]),
               "economy": eco, "fuel": {"size": cellv(f[13]), "unit": fuelUnit}, "dp": cellv(f[14]), "page": page}
        n = NOTES.get((engine, label))
        if n: row["_note"] = n
        rows.append(row)
keys = [r["key"] for r in rows]
assert len(keys) == len(set(keys)), "duplicate keys"
out = {"_source": "Rigger 2 Power Plant Table, book p.167-169, transcribed 2026-11-07 from 200-dpi renders (tools/transcribe/power-plants.py is the transcription; this file is generated). Second pass: docs/DESIGN-DATA-CHECK.md.",
       "powerPlants": rows}
json.dump(out, open(sys.argv[1], "w"), indent=1)
print(len(rows), "power plants")
