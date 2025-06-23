import mongoose from "mongoose";

const newsSchema = mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: true,
  },
  category: {
    type: String,
    trim: true,
    required: true,
  },
  source_type: {
    own: {
      my_article: {
        type: String,
        trim: true,
      },
    },
    other: {
      source_name: {
        type: String,
        trim: true,
      },
      source_url: {
        type: String,
        trim: true,
      },
    },
  },
  image: {
    type: String,
    trim: true,
  },
  image_url: {
    type: String,
    trim: true,
  },
  publish_date: {
    type: String,
    trim: true,
    required: true,
  },
  status: {
    type: String,
    trim: true,
    required: true,
  },
});

const News = mongoose.model("News", newsSchema);

export default News;
