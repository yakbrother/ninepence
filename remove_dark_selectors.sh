#!/bin/bash

# Create a backup of the original file
cp src/styles/global.css src/styles/global.css.bak

# Process the file to remove html.dark selectors and their blocks
awk '{
  if ($0 ~ /html\.dark/ && $0 ~ /{/) {
    # Skip the current line and count braces to find the end of the block
    skip = 1
    braces = 1
    print "/* Dark mode handled through CSS variables */"
  } else if (skip) {
    # Count braces to find the end of the block
    if ($0 ~ /{/) braces++
    if ($0 ~ /}/) braces--
    if (braces == 0) skip = 0
  } else {
    # Print lines that are not part of html.dark blocks
    print $0
  }
}' src/styles/global.css > src/styles/global.css.new

# Replace the original file with the processed one
mv src/styles/global.css.new src/styles/global.css

echo "Removed html.dark selectors from CSS file."
