import mongoose from "mongoose";

const matchSchema = mongoose.Schema(
  {
    sport_type: {
      type: String,
      trim: true,
      required: true,
    },
    league_type: {
      type: String,
      trim: true,
      required: true,
    },
    match_title: {
      type: String,
      trim: true,
      required: true,
    },
    match_time: {
      type: String,
      trim: true,
      required: true,
    },
    fixture_id: {
      type: String,
      trim: true,
    },
    hot_match: {
      type: Boolean,
    },
    status: {
      type: String,
      required: true,
    },
    team_one: {
      name: {
        type: String,
        trim: true,
        required: true,
      },
      image: {
        type: String,
        trim: true,
      },
    },
    team_two: {
      name: {
        type: String,
        trim: true,
        required: true,
      },
      image: {
        type: String,
        trim: true,
      },
    },
    streaming_source: [
      {
        streaming_title: {
          type: String,
          trim: true,
          required: true,
        },
        is_premium: {
          type: Boolean,
          required: true,
        },
        resolution: {
          type: String,
          trim: true,
          required: true,
        },
        platform: {
          type: String,
          trim: true,
          required: true,
        },
        portrait_watermark: {
          type: Object,
          required: true,
        },
        landscape_watermark: {
          type: Object,
          required: true,
        },
        status: {
          type: String,
          trim: true,
          required: true,
        },
        stream_type: {
          type: String,
          trim: true,
          required: true,
        },
        stream_url: {
          type: String,
          trim: true,
          required: true,
        },
        headers: [
          {
            key: String,
            value: String,
          },
        ],

        stream_thumbnail: {
          type: String,
          trim: true,
        },
      },
    ],
    order: { type: Number, default: 0 },
    thumbnail: { type: String, trim: true, required: true },
  },
  { timestamps: true }
);

const Matches = mongoose.model("Matches", matchSchema);

export default Matches;
