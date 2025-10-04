# syntax=docker/dockerfile:1
ARG NODE_VERSION=22.17.1

################################################################################
# STAGE 1: Base image for all stages
FROM node:${NODE_VERSION}-alpine as base
WORKDIR /app

################################################################################
# STAGE 2: Install production dependencies
FROM base as deps
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=yarn.lock,target=yarn.lock \
    --mount=type=cache,target=/root/.yarn/cache \
    yarn install --production --frozen-lockfile

################################################################################
# STAGE 3: Build the application
FROM base as build
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=yarn.lock,target=yarn.lock \
    --mount=type=cache,target=/root/.yarn/cache \
    yarn install --frozen-lockfile

COPY . .

# DEBUG: Show what files we have
RUN echo "=== Files in /app ===" && ls -la

# DEBUG: Check if temp directory exists
RUN echo "=== Checking temp directory ===" && \
    (ls -la temp 2>/dev/null || echo "No temp directory found")

# Run build with verbose output
RUN yarn run build

# DEBUG: Check what was created
RUN echo "=== After build ===" && ls -la && \
    echo "=== Checking dist directory ===" && \
    (ls -la dist 2>/dev/null || echo "No dist directory found") && \
    echo "=== Checking build directory ===" && \
    (ls -la build 2>/dev/null || echo "No build directory found")

################################################################################
# STAGE 4: Final image
FROM base as final

ENV NODE_ENV=production

COPY package.json yarn.lock ./
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

USER node

EXPOSE 3000
CMD ["yarn", "start"]
