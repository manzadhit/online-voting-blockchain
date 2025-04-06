// controllers/blockchainController.js
const httpStatus = require("http-status");
const blockchainService = require("../services/blockchain.service");
const catchAsync = require("../utils/catchAsync");

const getBlocks = catchAsync(async (req, res) => {
  const blocks = await blockchainService.getBlocks();
  return res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: "Blocks retrieved successfully",
    data: blocks,
  });
});

const getBlockByNumber = catchAsync(async (req, res) => {
  const { blockNumber } = req.params;
  const block = await blockchainService.getBlockByNumber(parseInt(blockNumber));
  return res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: "Block retrieved successfully",
    data: block,
  });
});

const verifyBlockIntegrity = catchAsync(async (req, res) => {
  const { blockNumber } = req.params;
  const isValid = await blockchainService.verifyBlockIntegrity(
    parseInt(blockNumber)
  );

  return res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: isValid ? "Block is valid" : "Block is invalid",
    data: { isValid },
  });
});

module.exports = {
  getBlocks,
  getBlockByNumber,
  verifyBlockIntegrity,
};
