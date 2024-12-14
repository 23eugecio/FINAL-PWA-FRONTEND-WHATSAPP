const extractFormData = (form_fields, form_values) => {
    for (let field in form_fields) {
        form_fields[field] = form_values.get(field)
    }
    return form_fields
}

export default extractFormData