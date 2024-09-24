const capitalizeFirstChar = (input: string) => {
	return input.charAt(0).toLocaleUpperCase() + input.slice(1);
};

export { capitalizeFirstChar };
