#!/usr/bin/env bash
# Set the next version in package.json and server.json and print it, counting up by the given level
# (major, minor or patch) from the newest release tag or the version on main, whichever is higher: a
# release on main is only tagged once it is published. A version the pull request set by hand, given
# as the second argument, is kept when it is still the current one and ahead of the tags.
set -e -u -o pipefail
level="$1"
requested="${2:-}"
newest="$(git tag --list --sort=-v:refname | grep -E '^[0-9]+\.[0-9]+\.[0-9]+$' | head -n 1)"
current="$(jq -r .version package.json)"
highest="$(printf '%s\n' "$newest" "$current" | sort -V | tail -n 1)"
if [[ "$requested" == "$current" && "$current" != "$newest" && "$highest" == "$current" ]]; then
	version="$current"
else
	IFS=. read -r major minor patch <<<"$highest"
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
