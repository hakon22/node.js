import type { CheckFieldsEditTypes } from '../types/CheckFieldsEdit';

const checkFieldsEdit: CheckFieldsEditTypes = (formik, setDefaultValue, general, ...other) => {
  if (general.edit) {
    other.forEach(({ edit, field }) => {
      if (edit) {
        setDefaultValue(field, formik);
      }
    });
    if (general.ref.current) {
      general.ref.current.select();
    }
  } else {
    setDefaultValue(general.field, formik);
  }
};

export default checkFieldsEdit;
