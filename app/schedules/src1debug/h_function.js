/**
 * Creates an HTML element with given tag, attributes, and children.
 * Similar to Hyperscript (h) or React.createElement.
 *
 * @param {string} tag - The HTML tag name (e.g., 'div', 'span', 'h1').
 * @param {object | null} attrs - An object containing attributes/props for the element.
 * - Standard HTML attributes (e.g., id, href, src).
 * - 'className' for CSS classes (maps to 'class').
 * - 'style' object for inline styles.
 * - Event listeners (e.g., onclick, onmouseover).
 * @param {...(string | number | Node | null | undefined | Array)} children -
 * Child elements or text content. Can be strings, numbers,
 * other DOM nodes, null/undefined (ignored), or nested arrays.
 * @returns {HTMLElement} The created HTML element.
 */
function h(tag, attrs, ...children) {
    // 1. Create the element
    const element = document.createElement(tag);

    // 2. Set attributes and properties
    if (attrs) {
        for (const key in attrs) {
            const value = attrs[key];

            // Handle className
            if (key === 'className') {
                element.className = value;
            }
            // Handle inline styles (expects an object)
            else if (key === 'style' && typeof value === 'object') {
                Object.assign(element.style, value);
            }
            // Handle event listeners (e.g., onclick)
            else if (key.startsWith('on') && typeof value === 'function') {
                const eventType = key.substring(2).toLowerCase();
                element.addEventListener(eventType, value);
            }
            // Handle boolean attributes (e.g., disabled, checked)
            else if (typeof value === 'boolean') {
                if (value) {
                    element.setAttribute(key, ''); // Set boolean attribute if true
                }
            }
            // Handle other standard attributes
            else if (value != null) { // Ensure value is not null or undefined
                element.setAttribute(key, value);
            }
        }
    }

    // 3. Append children
    const appendChild = (child) => {
        if (child === null || typeof child === 'undefined') {
            // Ignore null or undefined children
            return;
        } else if (typeof child === 'string' || typeof child === 'number') {
            // Append text nodes for strings and numbers
            element.appendChild(document.createTextNode(child.toString()));
        } else if (child instanceof Node) {
            // Append DOM nodes directly
            element.appendChild(child);
        } else if (Array.isArray(child)) {
            // Recursively append children if it's an array (flattens nested arrays)
            child.forEach(appendChild);
        } else {
            console.warn('Unsupported child type:', child);
        }
    };

    children.forEach(appendChild); // Process all children passed as arguments

    // 4. Return the created element
    return element;
}

// Export the function to make it available for import in other modules
export { h };
