#!/usr/bin/env sh
usage() {
    echo "Usage: $0 <new_directory_name> <remote_repo_url>"
	exit $1
}
[ "$1" = -h ] && usage 0
[ $# -ne 2 ] && usage 1
set -e

no_commit() {
	echo "DO NOT run this script on a new git repository without one or more commit(s)!"
	exit $1
}
test -z "$(git rev-list -n1 --all)" && no_commit 1
DIR=$1
URL=$2

git remote add -f $DIR $URL
echo "=== Remote branch added."
BRANCH=$(git branch -r | grep $DIR | xargs)

git merge -s ours --no-commit --allow-unrelated-histories $BRANCH
echo "=== Remote branch merged."

git read-tree --prefix=$DIR -u $BRANCH
echo "=== Remote history copied into specified directory."

git remote set-url --push $DIR no_push
echo "=== Disabled pushing to remote repo."

git commit -m "Merge remote-tracking branch '$BRANCH'"
echo "=== Subtree merged in $DIR."