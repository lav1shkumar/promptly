# Use Node.js 22 Debian-based slim image (Active LTS)
FROM node:22-slim

# Install curl
RUN apt-get update && apt-get install -y curl && apt-get clean && rm -rf /var/lib/apt/lists/*

# Copy compile script
COPY compile_page.sh /compile_page.sh
RUN chmod +x /compile_page.sh

# Set the final working directory right from the start
WORKDIR /home/user/app

# 1. Scaffold Next.js directly into the permanent directory
RUN npx --yes create-next-app@latest . --yes

# 2. Prevent npm from crashing on React 19 / Radix UI peer dependency conflicts
RUN npm config set legacy-peer-deps true

# 3. Initialize shadcn UI
# RUN npx --yes shadcn@latest init --yes -b radix -p nova --force

# 4. Install all components (safely bypassing prompts and conflicts)
# RUN npx --yes shadcn@latest add --all --yes --overwrite

# 5. Run the script to pre-compile the root page
RUN /compile_page.sh

# Expose port
EXPOSE 3000

# Default command
CMD ["npm", "run", "dev", "--", "-H", "0.0.0.0"]