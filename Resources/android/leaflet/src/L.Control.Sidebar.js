L.Control.Sidebar = L.Control.extend({
    includes: L.Mixin.Events,
    options: {
        closeButton: true,
        position: "left",
        autoPan: true
    },
    initialize: function(placeholder, options) {
        L.setOptions(this, options);
        var content = this._contentContainer = L.DomUtil.get(placeholder);
        content.parentNode.removeChild(content);
        var l = "leaflet-";
        var container = this._container = L.DomUtil.create("div", l + "sidebar " + this.options.position);
        L.DomUtil.addClass(content, l + "control");
        container.appendChild(content);
        if (this.options.closeButton) {
            var close = this._closeButton = L.DomUtil.create("a", "close", container);
            close.innerHTML = "&times;";
        }
    },
    addTo: function(map) {
        var container = this._container;
        var content = this._contentContainer;
        if (this.options.closeButton) {
            var close = this._closeButton;
            L.DomEvent.on(close, "click", this.hide, this);
        }
        L.DomEvent.on(container, "transitionend", this._handleTransitionEvent, this).on(container, "webkitTransitionEnd", this._handleTransitionEvent, this);
        var controlContainer = map._controlContainer;
        controlContainer.insertBefore(container, controlContainer.firstChild);
        this._map = map;
        var stop = L.DomEvent.stopPropagation;
        var fakeStop = L.DomEvent._fakeStop || stop;
        L.DomEvent.on(content, "contextmenu", stop).on(content, "click", fakeStop).on(content, "mousedown", stop).on(content, "touchstart", stop).on(content, "dblclick", fakeStop).on(content, "mousewheel", stop).on(content, "MozMousePixelScroll", stop);
        return this;
    },
    removeFrom: function(map) {
        this.hide();
        var content = this._contentContainer;
        var controlContainer = map._controlContainer;
        controlContainer.removeChild(this._container);
        this._map = null;
        var stop = L.DomEvent.stopPropagation;
        var fakeStop = L.DomEvent._fakeStop || stop;
        L.DomEvent.off(content, "contextmenu", stop).off(content, "click", fakeStop).off(content, "mousedown", stop).off(content, "touchstart", stop).off(content, "dblclick", fakeStop).off(content, "mousewheel", stop).off(content, "MozMousePixelScroll", stop);
        L.DomEvent.off(container, "transitionend", this._handleTransitionEvent, this).off(container, "webkitTransitionEnd", this._handleTransitionEvent, this);
        if (this._closeButton && this._close) {
            var close = this._closeButton;
            L.DomEvent.off(close, "click", this.hide, this);
        }
        return this;
    },
    isVisible: function() {
        return L.DomUtil.hasClass(this._container, "visible");
    },
    show: function() {
        if (!this.isVisible()) {
            L.DomUtil.addClass(this._container, "visible");
            this.options.autoPan && this._map.panBy([ -this.getOffset() / 2, 0 ], {
                duration: .5
            });
            this.fire("show");
        }
    },
    hide: function(e) {
        if (this.isVisible()) {
            L.DomUtil.removeClass(this._container, "visible");
            this.options.autoPan && this._map.panBy([ this.getOffset() / 2, 0 ], {
                duration: .5
            });
            this.fire("hide");
        }
        e && L.DomEvent.stopPropagation(e);
    },
    toggle: function() {
        this.isVisible() ? this.hide() : this.show();
    },
    getContainer: function() {
        return this._contentContainer;
    },
    getCloseButton: function() {
        return this._closeButton;
    },
    setContent: function(content) {
        this.getContainer().innerHTML = content;
        return this;
    },
    getOffset: function() {
        return "right" === this.options.position ? -this._container.offsetWidth : this._container.offsetWidth;
    },
    _handleTransitionEvent: function(e) {
        ("left" == e.propertyName || "right" == e.propertyName) && this.fire(this.isVisible() ? "shown" : "hidden");
    }
});

L.control.sidebar = function(placeholder, options) {
    return new L.Control.Sidebar(placeholder, options);
};