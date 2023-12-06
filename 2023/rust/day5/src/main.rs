use std::collections::HashMap;
use std::fs::File;
use std::io::{self, Read};

struct Mapping {
    d_start: i64,
    s_start: i64,
    range_length: i64,
}

fn prepare_mappings(map: &Vec<Mapping>) -> HashMap<i64, i64> {
    let mut mapping_dict = HashMap::new();
    for mapping in map {
        for i in 0..mapping.range_length {
            mapping_dict.insert(mapping.s_start + i, mapping.d_start + i);
        }
    }
    mapping_dict
}

fn find_mapping(number_to_map: i64, prepared_map: &HashMap<i64, i64>) -> i64 {
    *prepared_map.get(&number_to_map).unwrap_or(&number_to_map)
}

fn gather_map_info(lines: &Vec<&str>, map_key: &str, map_keys: &mut HashMap<String, Vec<Mapping>>) {
    let mut collect_info = false;
    for line in lines {
        if line.starts_with(&format!("{} map:", map_key)) {
            collect_info = true;
            continue;
        }
        if collect_info {
            if line.starts_with(map_key) {
                continue;
            }
            if line.is_empty() {
                collect_info = false;
                continue;
            }
            let string_split: Vec<&str> = line.split_whitespace().collect();
            let (d_start, s_start, range_length): (i64, i64, i64) = (
                string_split[0].parse().unwrap(),
                string_split[1].parse().unwrap(),
                string_split[2].parse().unwrap(),
            );

            let map_object = Mapping {
                d_start,
                s_start,
                range_length,
            };

            map_keys
                .entry(map_key.to_string())
                .or_insert(Vec::new())
                .push(map_object);
        }
    }
}

fn main() -> io::Result<()> {
    let mut file = File::open("./src/test.txt")?;
    let mut contents = String::new();
    file.read_to_string(&mut contents)?;
    let lines: Vec<&str> = contents.lines().collect();

    let mut seeds: Vec<i64> = Vec::new();
    let mut map_keys: HashMap<String, Vec<Mapping>> = HashMap::new();

    for line in &lines {
        if line.starts_with("seeds: ") {
            seeds = line
                .split(": ")
                .nth(1)
                .unwrap()
                .split_whitespace()
                .map(|s| s.parse().unwrap())
                .collect();
            continue;
        }

        if let Some(map_key) = line.split_whitespace().next() {
            gather_map_info(&lines, map_key, &mut map_keys);
        }
    }

    // Prepare mappings in advance
    let mut prepared_mappings: HashMap<String, HashMap<i64, i64>> = HashMap::new();
    for (key, mappings) in map_keys.iter() {
        prepared_mappings.insert(key.clone(), prepare_mappings(mappings));
    }

    let mut new_seeds = Vec::new();
    for (index, &seed) in seeds.iter().enumerate() {
        if index % 2 == 0 {
            if let Some(&next) = seeds.get(index + 1) {
                new_seeds.extend(seed..seed + next);
            }
        }
    }

    let mut locations = Vec::new();
    for seed in new_seeds {
        let soil = find_mapping(seed, &prepared_mappings["seed-to-soil"]);
        let fertilizer = find_mapping(soil, &prepared_mappings["soil-to-fertilizer"]);
        let water = find_mapping(fertilizer, &prepared_mappings["fertilizer-to-water"]);
        let light = find_mapping(water, &prepared_mappings["water-to-light"]);
        let temperature = find_mapping(light, &prepared_mappings["light-to-temperature"]);
        let humidity = find_mapping(temperature, &prepared_mappings["temperature-to-humidity"]);
        let location = find_mapping(humidity, &prepared_mappings["humidity-to-location"]);
        locations.push(location);
    }

    match locations.iter().min() {
        Some(&min) => println!("The smallest number is {}", min),
        None => println!("The array is empty"),
    }

    Ok(())
}
