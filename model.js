const mongoose = require('./db');

const RecordSchema = new mongoose.Schema({
  signature: { type: String, required: true, index: { unique: true } },
  funcCode: { type: String, required: true },
  label: Number, // 0: No issue, 1: Has code smell
  processed: { type: Boolean, default: false },
  repo: { type: String, required: true },

  // Analytical metrics
  physical_loc: Number, // the number of lines in a module or function
  logical_loc: Number, // a count of the imperative statements
  number_of_params: Number, // number of parameters the function takes
  maintainability: Number, // Defined by Paul Oman & Jack Hagemeister in 1991, this is a logarithmic scale from negative infinity to 171, higher is better
  cyclomatic: Number, // Cyclomatic complexity
  cyclomatic_density: Number,
  operators_total: Number,
  operators_distinct: Number,
  operands_total: Number,
  operands_distinct: Number
});

const Record = mongoose.model('Record', RecordSchema);

module.exports = {
  Record: Record
};
