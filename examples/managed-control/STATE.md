# State — managed-control fixture

**Build:** managed-control

## Next action
Nothing. THIS FIXTURE EXISTS TO FAIL.

It is a build this repo produced (that is what this file proves to the checker) that
publishes an image with no asset manifest at all, and animates on a build whose motion
policy is the default `none`. Both are blockers, and both are only blockers BECAUSE this
is a managed build: the same site audited from outside builds/ reports them as
observations, because a third-party site never agreed to a motion policy and was never
going to have a manifest.
