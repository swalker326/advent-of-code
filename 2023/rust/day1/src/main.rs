use std::fs::File;
use std::io::{self, BufRead};
use std::path::Path;

fn main() -> io::Result<()> {
    let path = Path::new("./src/input.txt");
    let file = File::open(&path)?;
    let reader = io::BufReader::new(file);
    //Game 92: 2 red, 3 blue, 6 green; 2 red, 2 blue, 8 green; 14 blue, 1 red, 1 green
    for line in reader.lines() {
        match line {
            Ok(l) => {
                
                println!("{}", l)
            },
            Err(e) => println!("Error: {}", e)
        }
    }
    Ok(())
}
