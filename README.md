# Syndicate Webflow CMS data from one site to many other Webflow sites

## Webflow Syndicator

This module provides functionality to syndicate a post across multiple Webflow sites. It uses the [Webflow API](https://developers.webflow.com/) to create content items within specified collections on multiple sites. To prevent hitting API rate limits, it incorporates the [Bottleneck](https://github.com/SGrondin/bottleneck) library, which is a powerful rate limiter.

### Dependencies

- **express**: Used for routing and handling HTTP requests.
- **webflow-api**: A wrapper around the Webflow API for easier interfacing.
- **bottleneck**: A rate limiter to ensure we don't exceed Webflow's API rate limits.
- **dotenv**: Loads environment variables from a `.env` file.

### Configuration

The sites to which the posts will be syndicated are configured in the `sites` array. Each site entry should have the following structure:

```javascript
{
  siteId: "YOUR_WEBFLOW_SITE_ID",
  collectionId: "YOUR_WEBFLOW_COLLECTION_ID",
  siteApiKey: process.env.YOUR_ENV_VARIABLE_FOR_API_KEY,
}
```

### Endpoint

- **POST /syndicate-post**: Accepts a post payload and syndicates it across all configured Webflow sites. The request body should be structured in a way that provides all necessary post details.

### Functions

- **convertToHtml(data)**: Converts a provided data array into an HTML string based on block types. Currently, it supports 'Heading' and 'Paragraph' block types, but more can be added as needed.

### How It Works

1. A POST request is made to `/syndicate-post` with the post's data.
2. The `convertToHtml` function transforms the post data into an HTML format suitable for Webflow.
3. For each site configured in the `sites` array:
   - An instance of the Webflow API is initialized using the site's specific API key.
   - A rate-limited request is made to create a new content item in the site's specified collection.
4. If all requests succeed, a success response is sent. If any fail, an error response is returned.

### Environment Variables

Ensure you have a `.env` file at the root of your project and it contains the API keys for your Webflow sites:

```
SITE_ONE_API_KEY=YOUR_SITE_ONE_API_KEY
SITE_TWO_API_KEY=YOUR_SITE_TWO_API_KEY
SITE_THREE_API_KEY=YOUR_SITE_THREE_API_KEY
```

Replace `YOUR_SITE_ONE_API_KEY`, `YOUR_SITE_TWO_API_KEY`, and `YOUR_SITE_THREE_API_KEY` with your actual Webflow API keys.
