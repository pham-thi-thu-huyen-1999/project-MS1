String.prototype.capitalize = function() {
    if (this.length)
        return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
    return '';
};
