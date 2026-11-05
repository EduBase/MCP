#!/usr/bin/env bash
# Set the next version in package.json and server.json and print it, from the newest release tag and
# the given level (major, minor or patch). A package.json already ahead of the tags is kept as it is.
set -e -u -o pipefail
level="$1"
newest="$(git tag --list --sort=-v:refname | grep -E '^[0-9]+\.[0-9]+\.[0-9]+$' | head -n 1)"
current="$(jq -r .version package.json)"
if [[ "$current" != "$newest" && "$(printf '%s\n' "$newest" "$current" | sort -V | tail -n 1)" == "$current" ]]; then
	version="$current"
else
	IFS=. read -r major minor patch <<<"$newest"
	case "$level" in
		major) version="$((major + 1)).0.0" ;;
		minor) version="$major.$((minor + 1)).0" ;;
		patch) version="$major.$minor.$((patch + 1))" ;;
		*) echo "Unknown level: $level" >&2; exit 1 ;;
	esac
fi
content="$(jq --arg version "$version" '.version = $version' package.json)"
printf '%s\n' "$content" > package.json
content="$(jq --arg version "$version" '.version = $version | .packages[0].version = $version' server.json)"
printf '%s\n' "$content" > server.json
echo "$version"
