const express = require("express");
const Webflow = require("webflow-api");
const Bottleneck = require("bottleneck");
require("dotenv").config();
const router = express.Router();

const limiter = new Bottleneck({
  minTime: 1000,
});

// Array of sites with siteId, collectionId, and siteApiKey
const sites = [
  {
    siteId: "64dbf04907aed84bec098152",
    collectionId: "64dbf04907aed84bec09817c",
    siteApiKey: process.env.SITE_ONE_API_KEY,
  },
  {
    siteId: "64dbf0fe3e4ebd3032bc5a36",
    collectionId: "64dbf0fe3e4ebd3032bc5a60",
    siteApiKey: process.env.SITE_TWO_API_KEY,
  },
  {
    siteId: "64dbf12b8aaca4193c5c5595",
    collectionId: "64dbf12b8aaca4193c5c55bf",
    siteApiKey: process.env.SITE_THREE_API_KEY,
  },
  // ... add more sites as needed
];

router.post("/syndicate-post", async (req, res) => {
  console.log("Webhook received");
  const postData = req.body;

  const tasks = sites.map((site) => {
    console.log(site.siteId, site.collectionId, site.siteApiKey);
    const postBodyHtml = convertToHtml(postData["post-body"]);
    const newItem = {
      _archived: false,
      _draft: false,
      name: postData.name,
      slug: postData.slug,
      "post-summary": postData["post-summary"],
      "post-body": postBodyHtml,
      featured: postData.featured,
      "thumbnail-image": postData["thumbnail-image"].url,
      "main-image": postData["main-image"].url,
      color: postData.color,
    };

    const siteWebflow = new Webflow({
      token: site.siteApiKey,
    });

    return limiter
      .schedule(() =>
        siteWebflow.post(`collections/${site.collectionId}/items?live=true`, {
          fields: newItem,
        })
      )
      .then((response) => {
        console.log(
          `Created post in site with ID: ${site.siteId} and collection ID: ${site.collectionId}`
        );
        return response;
      })
      .catch((error) => {
        console.error(
          `Failed to add to Webflow CMS for site with ID: ${site.siteId} and collection ID: ${site.collectionId}`,
          error.response.data
        );
        throw error; // This will reject the Promise returned by tasks.
      });
  });

  try {
    await Promise.all(tasks);
    res.status(200).send("Post syndicated across sites");
  } catch (error) {
    res.status(500).send("Failed to syndicate post across all sites");
  }
});

function convertToHtml(data) {
  let htmlContent = "";

  data.forEach((block) => {
    switch (block.type) {
      case "Heading":
        const headingText = data.find(
          (item) => item._id === block.children[0]
        ).v;
        htmlContent += `<${block.tag}>${headingText}</${block.tag}>`;
        break;
      case "Paragraph":
        const paraText = data.find((item) => item._id === block.children[0]).v;
        htmlContent += `<${block.tag}>${paraText}</${block.tag}>`;
        break;
      // Handle other block types as needed
      default:
        break;
    }
  });

  return htmlContent;
}

module.exports = router;
