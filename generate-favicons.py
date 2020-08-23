from PIL import Image
import argparse
from pathlib import Path

parser = argparse.ArgumentParser()
parser.add_argument("filename")
parser.add_argument("--output", default="favicons")
parser.add_argument("--sizes")
args = parser.parse_args()

filename = args.filename
output = args.output

if args.sizes:
    sizes = [int(x) for x in args.sizes.split(",")]
else:
    sizes = [16, 32, 48, 57, 60, 64, 72, 96, 114, 128, 150, 152, 160, 180, 192, 310]

Path(output).mkdir(parents=True, exist_ok=True)

img = Image.open(filename)
img.save("{}/favicon.ico".format(output), format="ICO", sizes=[(32,32)])
for size in sizes:
    img.resize((size, size)).save("{}/favicon-{}.png".format(output, size), format="PNG")
