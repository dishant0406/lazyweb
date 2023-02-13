#!/bin/bash

# Define the source folder as the current directory
src_folder=$(pwd)

# Remove all existing webp files
find "$src_folder" -type f -name "*.webp" -delete

# Find all png files in the source folder and its subdirectories
find "$src_folder" -type f -name "*.png" | while read file; do
  # Construct the destination file path by replacing the extension
  dest_file="${file%.*}.webp"

  # Use the cwebp tool to convert the file
  cwebp -q 50 "$file" -o "$dest_file"
done

