import News from "./newsModel.js";

const getAllNews = async (req, res) => {
  const perPage = parseInt(req.query.perPage);
  const searchQuery = req.query.search || "";
  try {
    let query = {};
    if (req.query.search) {
      query.title = { $regex: searchQuery, $options: "i" };
    }
    const count = await News.countDocuments(query);
    const paginatedNews = await News.find(query)
      .sort({ title: 1 })
      .limit(perPage);
    const totalPages = Math.ceil(count / perPage);
    res.status(200).json({
      success: true,
      message: "all news",
      totalPages,
      count,
      paginatedNews,
    });
  } catch (error) {
    console.log(error?.message);
    res.status(500).json(error.message);
  }
};

const getNewsById = async (req, res) => {
  const { id } = req.params;
  try {
    const news = await News.findById(id);

    res.status(200).json({
      success: true,
      message: "Single news",
      news,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      mesaage: `${error?.message}`,
    });
  }
};

const deleteNewsById = async (req, res) => {
  const { id } = req.params;
  try {
    if (id) {
      await News.findByIdAndDelete({ _id: id });
      res.status(200).json({
        success: true,
        message: " deleted successfully",
      });
    } else {
      res.status(500).json({
        success: false,
        message: "You are not able to delete this",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `${error?.message}`,
    });
  }
};

export { getAllNews, getNewsById, deleteNewsById };
