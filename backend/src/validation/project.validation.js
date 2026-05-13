export const validateProject = ({
    name
}) => {

    if (!name) {
        return "Project name is required";
    }

    return null;
};