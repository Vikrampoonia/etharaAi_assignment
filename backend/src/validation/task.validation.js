export const validateTask = ({
    title
}) => {

    if (!title) {
        return "Task title is required";
    }

    return null;
};