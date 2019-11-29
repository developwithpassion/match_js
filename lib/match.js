import create_iterator from '@developwithpassion/create_object_iterator_js';
import {
  is_object,
  condition,
  equal_to,
  and,
  or,
  is_function,
  never_matches,
  anything
} from '@developwithpassion/matchers_js';
import { nested_property_accessor as nested_value_accessor } from '@developwithpassion/core_utils_js';

const create_criteria_iterator = criteria =>
  create_iterator({
    target: criteria,
    nested_constraint: is_object
  });

const default_value_accessor = key => target => target[key];

const attribute_matcher = (key, matcher) => {
  const value_accessor = key.indexOf('.') === -1 ? default_value_accessor(key) : nested_value_accessor(key);

  return condition(target => matcher(value_accessor(target)));
};

const create_criteria_from_map = (initial, criteria, combination_style) => {
  let matcher = initial;

  const iterator = create_criteria_iterator(criteria);

  iterator(pair => {
    const value_matcher = is_function(pair.value) ? pair.value : equal_to(pair.value);
    const next_matcher = attribute_matcher(pair.key, value_matcher);

    matcher = matcher === null ? next_matcher : combination_style(matcher, next_matcher);
  });

  return matcher;
};

export const criteria = criteria => create_criteria_from_map(anything, criteria, and);

export const or_criteria = criteria => create_criteria_from_map(never_matches, criteria, or);

export default {
  create_and_criteria: criteria,
  create_or_criteria: or_criteria
};
