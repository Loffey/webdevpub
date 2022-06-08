
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function compute_rest_props(props, keys) {
        const rest = {};
        keys = new Set(keys);
        for (const k in props)
            if (!keys.has(k) && k[0] !== '$')
                rest[k] = props[k];
        return rest;
    }
    function set_store_value(store, ret, value) {
        store.set(value);
        return ret;
    }
    function action_destroyer(action_result) {
        return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function get_root_for_style(node) {
        if (!node)
            return document;
        const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
        if (root && root.host) {
            return root;
        }
        return node.ownerDocument;
    }
    function append_empty_stylesheet(node) {
        const style_element = element('style');
        append_stylesheet(get_root_for_style(node), style_element);
        return style_element.sheet;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function stop_propagation(fn) {
        return function (event) {
            event.stopPropagation();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_attributes(node, attributes) {
        // @ts-ignore
        const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
        for (const key in attributes) {
            if (attributes[key] == null) {
                node.removeAttribute(key);
            }
            else if (key === 'style') {
                node.style.cssText = attributes[key];
            }
            else if (key === '__value') {
                node.value = node[key] = attributes[key];
            }
            else if (descriptors[key] && descriptors[key].set) {
                node[key] = attributes[key];
            }
            else {
                attr(node, key, attributes[key]);
            }
        }
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    // we need to store the information for multiple documents because a Svelte application could also contain iframes
    // https://github.com/sveltejs/svelte/issues/3624
    const managed_styles = new Map();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_style_information(doc, node) {
        const info = { stylesheet: append_empty_stylesheet(node), rules: {} };
        managed_styles.set(doc, info);
        return info;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = get_root_for_style(node);
        const { stylesheet, rules } = managed_styles.get(doc) || create_style_information(doc, node);
        if (!rules[name]) {
            rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            managed_styles.forEach(info => {
                const { stylesheet } = info;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                info.rules = {};
            });
            managed_styles.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    const null_transition = { duration: 0 };
    function create_in_transition(node, fn, params) {
        let config = fn(node, params);
        let running = false;
        let animation_name;
        let task;
        let uid = 0;
        function cleanup() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
            tick(0, 1);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            if (task)
                task.abort();
            running = true;
            add_render_callback(() => dispatch(node, true, 'start'));
            task = loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(1, 0);
                        dispatch(node, true, 'end');
                        cleanup();
                        return running = false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(t, 1 - t);
                    }
                }
                return running;
            });
        }
        let started = false;
        return {
            start() {
                if (started)
                    return;
                started = true;
                delete_rule(node);
                if (is_function(config)) {
                    config = config();
                    wait().then(go);
                }
                else {
                    go();
                }
            },
            invalidate() {
                started = false;
            },
            end() {
                if (running) {
                    cleanup();
                    running = false;
                }
            }
        };
    }
    function create_out_transition(node, fn, params) {
        let config = fn(node, params);
        let running = true;
        let animation_name;
        const group = outros;
        group.r += 1;
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 1, 0, duration, delay, easing, css);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            add_render_callback(() => dispatch(node, false, 'start'));
            loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(0, 1);
                        dispatch(node, false, 'end');
                        if (!--group.r) {
                            // this will result in `end()` being called,
                            // so we don't need to clean up here
                            run_all(group.c);
                        }
                        return false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(1 - t, t);
                    }
                }
                return running;
            });
        }
        if (is_function(config)) {
            wait().then(() => {
                // @ts-ignore
                config = config();
                go();
            });
        }
        else {
            go();
        }
        return {
            end(reset) {
                if (reset && config.tick) {
                    config.tick(1, 0);
                }
                if (running) {
                    if (animation_name)
                        delete_rule(node, animation_name);
                    running = false;
                }
            }
        };
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.48.0' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    const chosen_video = writable();

    const video_player_is_active = writable(false);

    /* eslint-disable no-param-reassign */

    /**
     * Options for customizing ripples
     */
    const defaults = {
      color: 'currentColor',
      class: '',
      opacity: 0.1,
      centered: false,
      spreadingDuration: '.4s',
      spreadingDelay: '0s',
      spreadingTimingFunction: 'linear',
      clearingDuration: '1s',
      clearingDelay: '0s',
      clearingTimingFunction: 'ease-in-out',
    };

    /**
     * Creates a ripple element but does not destroy it (use RippleStop for that)
     *
     * @param {Event} e
     * @param {*} options
     * @returns Ripple element
     */
    function RippleStart(e, options = {}) {
      e.stopImmediatePropagation();
      const opts = { ...defaults, ...options };

      const isTouchEvent = e.touches ? !!e.touches[0] : false;
      // Parent element
      const target = isTouchEvent ? e.touches[0].currentTarget : e.currentTarget;

      // Create ripple
      const ripple = document.createElement('div');
      const rippleStyle = ripple.style;

      // Adding default stuff
      ripple.className = `material-ripple ${opts.class}`;
      rippleStyle.position = 'absolute';
      rippleStyle.color = 'inherit';
      rippleStyle.borderRadius = '50%';
      rippleStyle.pointerEvents = 'none';
      rippleStyle.width = '100px';
      rippleStyle.height = '100px';
      rippleStyle.marginTop = '-50px';
      rippleStyle.marginLeft = '-50px';
      target.appendChild(ripple);
      rippleStyle.opacity = opts.opacity;
      rippleStyle.transition = `transform ${opts.spreadingDuration} ${opts.spreadingTimingFunction} ${opts.spreadingDelay},opacity ${opts.clearingDuration} ${opts.clearingTimingFunction} ${opts.clearingDelay}`;
      rippleStyle.transform = 'scale(0) translate(0,0)';
      rippleStyle.background = opts.color;

      // Positioning ripple
      const targetRect = target.getBoundingClientRect();
      if (opts.centered) {
        rippleStyle.top = `${targetRect.height / 2}px`;
        rippleStyle.left = `${targetRect.width / 2}px`;
      } else {
        const distY = isTouchEvent ? e.touches[0].clientY : e.clientY;
        const distX = isTouchEvent ? e.touches[0].clientX : e.clientX;
        rippleStyle.top = `${distY - targetRect.top}px`;
        rippleStyle.left = `${distX - targetRect.left}px`;
      }

      // Enlarge ripple
      rippleStyle.transform = `scale(${
    Math.max(targetRect.width, targetRect.height) * 0.02
  }) translate(0,0)`;
      return ripple;
    }

    /**
     * Destroys the ripple, slowly fading it out.
     *
     * @param {Element} ripple
     */
    function RippleStop(ripple) {
      if (ripple) {
        ripple.addEventListener('transitionend', (e) => {
          if (e.propertyName === 'opacity') ripple.remove();
        });
        ripple.style.opacity = 0;
      }
    }

    /**
     * @param node {Element}
     */
    var Ripple = (node, _options = {}) => {
      let options = _options;
      let destroyed = false;
      let ripple;
      let keyboardActive = false;
      const handleStart = (e) => {
        ripple = RippleStart(e, options);
      };
      const handleStop = () => RippleStop(ripple);
      const handleKeyboardStart = (e) => {
        if (!keyboardActive && (e.keyCode === 13 || e.keyCode === 32)) {
          ripple = RippleStart(e, { ...options, centered: true });
          keyboardActive = true;
        }
      };
      const handleKeyboardStop = () => {
        keyboardActive = false;
        handleStop();
      };

      function setup() {
        node.classList.add('s-ripple-container');
        node.addEventListener('pointerdown', handleStart);
        node.addEventListener('pointerup', handleStop);
        node.addEventListener('pointerleave', handleStop);
        node.addEventListener('keydown', handleKeyboardStart);
        node.addEventListener('keyup', handleKeyboardStop);
        destroyed = false;
      }

      function destroy() {
        node.classList.remove('s-ripple-container');
        node.removeEventListener('pointerdown', handleStart);
        node.removeEventListener('pointerup', handleStop);
        node.removeEventListener('pointerleave', handleStop);
        node.removeEventListener('keydown', handleKeyboardStart);
        node.removeEventListener('keyup', handleKeyboardStop);
        destroyed = true;
      }

      if (options) setup();

      return {
        update(newOptions) {
          options = newOptions;
          if (options && destroyed) setup();
          else if (!(options || destroyed)) destroy();
        },
        destroy,
      };
    };

    const filter = (classes) => classes.filter((x) => !!x);
    const format$1 = (classes) => classes.split(' ').filter((x) => !!x);

    /**
     * @param node {Element}
     * @param classes {Array<string>}
     */
    var Class = (node, _classes) => {
      let classes = _classes;
      node.classList.add(...format$1(filter(classes).join(' ')));
      return {
        update(_newClasses) {
          const newClasses = _newClasses;
          newClasses.forEach((klass, i) => {
            if (klass) node.classList.add(...format$1(klass));
            else if (classes[i]) node.classList.remove(...format$1(classes[i]));
          });
          classes = newClasses;
        },
      };
    };

    /* node_modules\svelte-materialify\dist\components\Button\Button.svelte generated by Svelte v3.48.0 */
    const file$4 = "node_modules\\svelte-materialify\\dist\\components\\Button\\Button.svelte";

    function create_fragment$4(ctx) {
    	let button_1;
    	let span;
    	let button_1_class_value;
    	let Class_action;
    	let Ripple_action;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[19].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[18], null);

    	let button_1_levels = [
    		{
    			class: button_1_class_value = "s-btn size-" + /*size*/ ctx[5] + " " + /*klass*/ ctx[1]
    		},
    		{ type: /*type*/ ctx[14] },
    		{ style: /*style*/ ctx[16] },
    		{ disabled: /*disabled*/ ctx[11] },
    		{ "aria-disabled": /*disabled*/ ctx[11] },
    		/*$$restProps*/ ctx[17]
    	];

    	let button_1_data = {};

    	for (let i = 0; i < button_1_levels.length; i += 1) {
    		button_1_data = assign(button_1_data, button_1_levels[i]);
    	}

    	const block_1 = {
    		c: function create() {
    			button_1 = element("button");
    			span = element("span");
    			if (default_slot) default_slot.c();
    			attr_dev(span, "class", "s-btn__content");
    			add_location(span, file$4, 46, 2, 5233);
    			set_attributes(button_1, button_1_data);
    			toggle_class(button_1, "s-btn--fab", /*fab*/ ctx[2]);
    			toggle_class(button_1, "icon", /*icon*/ ctx[3]);
    			toggle_class(button_1, "block", /*block*/ ctx[4]);
    			toggle_class(button_1, "tile", /*tile*/ ctx[6]);
    			toggle_class(button_1, "text", /*text*/ ctx[7] || /*icon*/ ctx[3]);
    			toggle_class(button_1, "depressed", /*depressed*/ ctx[8] || /*text*/ ctx[7] || /*disabled*/ ctx[11] || /*outlined*/ ctx[9] || /*icon*/ ctx[3]);
    			toggle_class(button_1, "outlined", /*outlined*/ ctx[9]);
    			toggle_class(button_1, "rounded", /*rounded*/ ctx[10]);
    			toggle_class(button_1, "disabled", /*disabled*/ ctx[11]);
    			add_location(button_1, file$4, 26, 0, 4783);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button_1, anchor);
    			append_dev(button_1, span);

    			if (default_slot) {
    				default_slot.m(span, null);
    			}

    			if (button_1.autofocus) button_1.focus();
    			/*button_1_binding*/ ctx[21](button_1);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(Class_action = Class.call(null, button_1, [/*active*/ ctx[12] && /*activeClass*/ ctx[13]])),
    					action_destroyer(Ripple_action = Ripple.call(null, button_1, /*ripple*/ ctx[15])),
    					listen_dev(button_1, "click", /*click_handler*/ ctx[20], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 262144)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[18],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[18])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[18], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(button_1, button_1_data = get_spread_update(button_1_levels, [
    				(!current || dirty & /*size, klass*/ 34 && button_1_class_value !== (button_1_class_value = "s-btn size-" + /*size*/ ctx[5] + " " + /*klass*/ ctx[1])) && { class: button_1_class_value },
    				(!current || dirty & /*type*/ 16384) && { type: /*type*/ ctx[14] },
    				(!current || dirty & /*style*/ 65536) && { style: /*style*/ ctx[16] },
    				(!current || dirty & /*disabled*/ 2048) && { disabled: /*disabled*/ ctx[11] },
    				(!current || dirty & /*disabled*/ 2048) && { "aria-disabled": /*disabled*/ ctx[11] },
    				dirty & /*$$restProps*/ 131072 && /*$$restProps*/ ctx[17]
    			]));

    			if (Class_action && is_function(Class_action.update) && dirty & /*active, activeClass*/ 12288) Class_action.update.call(null, [/*active*/ ctx[12] && /*activeClass*/ ctx[13]]);
    			if (Ripple_action && is_function(Ripple_action.update) && dirty & /*ripple*/ 32768) Ripple_action.update.call(null, /*ripple*/ ctx[15]);
    			toggle_class(button_1, "s-btn--fab", /*fab*/ ctx[2]);
    			toggle_class(button_1, "icon", /*icon*/ ctx[3]);
    			toggle_class(button_1, "block", /*block*/ ctx[4]);
    			toggle_class(button_1, "tile", /*tile*/ ctx[6]);
    			toggle_class(button_1, "text", /*text*/ ctx[7] || /*icon*/ ctx[3]);
    			toggle_class(button_1, "depressed", /*depressed*/ ctx[8] || /*text*/ ctx[7] || /*disabled*/ ctx[11] || /*outlined*/ ctx[9] || /*icon*/ ctx[3]);
    			toggle_class(button_1, "outlined", /*outlined*/ ctx[9]);
    			toggle_class(button_1, "rounded", /*rounded*/ ctx[10]);
    			toggle_class(button_1, "disabled", /*disabled*/ ctx[11]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button_1);
    			if (default_slot) default_slot.d(detaching);
    			/*button_1_binding*/ ctx[21](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block_1;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	const omit_props_names = [
    		"class","fab","icon","block","size","tile","text","depressed","outlined","rounded","disabled","active","activeClass","type","ripple","style","button"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Button', slots, ['default']);
    	let { class: klass = '' } = $$props;
    	let { fab = false } = $$props;
    	let { icon = false } = $$props;
    	let { block = false } = $$props;
    	let { size = 'default' } = $$props;
    	let { tile = false } = $$props;
    	let { text = false } = $$props;
    	let { depressed = false } = $$props;
    	let { outlined = false } = $$props;
    	let { rounded = false } = $$props;
    	let { disabled = null } = $$props;
    	let { active = false } = $$props;
    	let { activeClass = 'active' } = $$props;
    	let { type = 'button' } = $$props;
    	let { ripple = {} } = $$props;
    	let { style = null } = $$props;
    	let { button = null } = $$props;

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function button_1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			button = $$value;
    			$$invalidate(0, button);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(17, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(1, klass = $$new_props.class);
    		if ('fab' in $$new_props) $$invalidate(2, fab = $$new_props.fab);
    		if ('icon' in $$new_props) $$invalidate(3, icon = $$new_props.icon);
    		if ('block' in $$new_props) $$invalidate(4, block = $$new_props.block);
    		if ('size' in $$new_props) $$invalidate(5, size = $$new_props.size);
    		if ('tile' in $$new_props) $$invalidate(6, tile = $$new_props.tile);
    		if ('text' in $$new_props) $$invalidate(7, text = $$new_props.text);
    		if ('depressed' in $$new_props) $$invalidate(8, depressed = $$new_props.depressed);
    		if ('outlined' in $$new_props) $$invalidate(9, outlined = $$new_props.outlined);
    		if ('rounded' in $$new_props) $$invalidate(10, rounded = $$new_props.rounded);
    		if ('disabled' in $$new_props) $$invalidate(11, disabled = $$new_props.disabled);
    		if ('active' in $$new_props) $$invalidate(12, active = $$new_props.active);
    		if ('activeClass' in $$new_props) $$invalidate(13, activeClass = $$new_props.activeClass);
    		if ('type' in $$new_props) $$invalidate(14, type = $$new_props.type);
    		if ('ripple' in $$new_props) $$invalidate(15, ripple = $$new_props.ripple);
    		if ('style' in $$new_props) $$invalidate(16, style = $$new_props.style);
    		if ('button' in $$new_props) $$invalidate(0, button = $$new_props.button);
    		if ('$$scope' in $$new_props) $$invalidate(18, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		Ripple,
    		Class,
    		klass,
    		fab,
    		icon,
    		block,
    		size,
    		tile,
    		text,
    		depressed,
    		outlined,
    		rounded,
    		disabled,
    		active,
    		activeClass,
    		type,
    		ripple,
    		style,
    		button
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('klass' in $$props) $$invalidate(1, klass = $$new_props.klass);
    		if ('fab' in $$props) $$invalidate(2, fab = $$new_props.fab);
    		if ('icon' in $$props) $$invalidate(3, icon = $$new_props.icon);
    		if ('block' in $$props) $$invalidate(4, block = $$new_props.block);
    		if ('size' in $$props) $$invalidate(5, size = $$new_props.size);
    		if ('tile' in $$props) $$invalidate(6, tile = $$new_props.tile);
    		if ('text' in $$props) $$invalidate(7, text = $$new_props.text);
    		if ('depressed' in $$props) $$invalidate(8, depressed = $$new_props.depressed);
    		if ('outlined' in $$props) $$invalidate(9, outlined = $$new_props.outlined);
    		if ('rounded' in $$props) $$invalidate(10, rounded = $$new_props.rounded);
    		if ('disabled' in $$props) $$invalidate(11, disabled = $$new_props.disabled);
    		if ('active' in $$props) $$invalidate(12, active = $$new_props.active);
    		if ('activeClass' in $$props) $$invalidate(13, activeClass = $$new_props.activeClass);
    		if ('type' in $$props) $$invalidate(14, type = $$new_props.type);
    		if ('ripple' in $$props) $$invalidate(15, ripple = $$new_props.ripple);
    		if ('style' in $$props) $$invalidate(16, style = $$new_props.style);
    		if ('button' in $$props) $$invalidate(0, button = $$new_props.button);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		button,
    		klass,
    		fab,
    		icon,
    		block,
    		size,
    		tile,
    		text,
    		depressed,
    		outlined,
    		rounded,
    		disabled,
    		active,
    		activeClass,
    		type,
    		ripple,
    		style,
    		$$restProps,
    		$$scope,
    		slots,
    		click_handler,
    		button_1_binding
    	];
    }

    class Button extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {
    			class: 1,
    			fab: 2,
    			icon: 3,
    			block: 4,
    			size: 5,
    			tile: 6,
    			text: 7,
    			depressed: 8,
    			outlined: 9,
    			rounded: 10,
    			disabled: 11,
    			active: 12,
    			activeClass: 13,
    			type: 14,
    			ripple: 15,
    			style: 16,
    			button: 0
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Button",
    			options,
    			id: create_fragment$4.name
    		});
    	}

    	get class() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fab() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fab(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get icon() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set icon(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get block() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set block(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tile() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tile(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get text() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set text(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get depressed() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set depressed(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get outlined() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set outlined(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get rounded() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rounded(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get active() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set active(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get activeClass() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set activeClass(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get type() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ripple() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ripple(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get button() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set button(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* eslint-disable */
    // Shamefully ripped from https://github.com/lukeed/uid
    let IDX = 36;
    let HEX = '';
    while (IDX--) HEX += IDX.toString(36);

    function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }

    /* eslint-disable no-param-reassign */

    const themeColors = ['primary', 'secondary', 'success', 'info', 'warning', 'error'];

    /**
     * @param {string} klass
     */
    function formatClass(klass) {
      return klass.split(' ').map((i) => {
        if (themeColors.includes(i)) return `${i}-color`;
        return i;
      });
    }

    function setBackgroundColor(node, text) {
      if (/^(#|rgb|hsl|currentColor)/.test(text)) {
        // This is a CSS hex.
        node.style.backgroundColor = text;
        return false;
      }

      if (text.startsWith('--')) {
        // This is a CSS variable.
        node.style.backgroundColor = `var(${text})`;
        return false;
      }

      const klass = formatClass(text);
      node.classList.add(...klass);
      return klass;
    }

    /**
     * @param node {Element}
     * @param text {string|boolean}
     */
    var BackgroundColor = (node, text) => {
      let klass;
      if (typeof text === 'string') {
        klass = setBackgroundColor(node, text);
      }

      return {
        update(newText) {
          if (klass) {
            node.classList.remove(...klass);
          } else {
            node.style.backgroundColor = null;
          }

          if (typeof newText === 'string') {
            klass = setBackgroundColor(node, newText);
          }
        },
      };
    };

    /* node_modules\svelte-materialify\dist\components\Overlay\Overlay.svelte generated by Svelte v3.48.0 */
    const file$3 = "node_modules\\svelte-materialify\\dist\\components\\Overlay\\Overlay.svelte";

    // (20:0) {#if active}
    function create_if_block$1(ctx) {
    	let div2;
    	let div0;
    	let BackgroundColor_action;
    	let t;
    	let div1;
    	let div2_class_value;
    	let div2_style_value;
    	let div2_intro;
    	let div2_outro;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[11].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[10], null);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			t = space();
    			div1 = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div0, "class", "s-overlay__scrim svelte-zop6hb");
    			set_style(div0, "opacity", /*opacity*/ ctx[5]);
    			add_location(div0, file$3, 27, 4, 1076);
    			attr_dev(div1, "class", "s-overlay__content svelte-zop6hb");
    			add_location(div1, file$3, 28, 4, 1167);
    			attr_dev(div2, "class", div2_class_value = "s-overlay " + /*klass*/ ctx[0] + " svelte-zop6hb");
    			attr_dev(div2, "style", div2_style_value = "z-index:" + /*index*/ ctx[7] + ";" + /*style*/ ctx[9]);
    			toggle_class(div2, "absolute", /*absolute*/ ctx[8]);
    			add_location(div2, file$3, 20, 2, 912);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div2, t);
    			append_dev(div2, div1);

    			if (default_slot) {
    				default_slot.m(div1, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(BackgroundColor_action = BackgroundColor.call(null, div0, /*color*/ ctx[6])),
    					listen_dev(div2, "click", /*click_handler*/ ctx[12], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (!current || dirty & /*opacity*/ 32) {
    				set_style(div0, "opacity", /*opacity*/ ctx[5]);
    			}

    			if (BackgroundColor_action && is_function(BackgroundColor_action.update) && dirty & /*color*/ 64) BackgroundColor_action.update.call(null, /*color*/ ctx[6]);

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1024)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[10],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[10])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[10], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*klass*/ 1 && div2_class_value !== (div2_class_value = "s-overlay " + /*klass*/ ctx[0] + " svelte-zop6hb")) {
    				attr_dev(div2, "class", div2_class_value);
    			}

    			if (!current || dirty & /*index, style*/ 640 && div2_style_value !== (div2_style_value = "z-index:" + /*index*/ ctx[7] + ";" + /*style*/ ctx[9])) {
    				attr_dev(div2, "style", div2_style_value);
    			}

    			if (dirty & /*klass, absolute*/ 257) {
    				toggle_class(div2, "absolute", /*absolute*/ ctx[8]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);

    			add_render_callback(() => {
    				if (div2_outro) div2_outro.end(1);
    				div2_intro = create_in_transition(div2, /*transition*/ ctx[1], /*inOpts*/ ctx[2]);
    				div2_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			if (div2_intro) div2_intro.invalidate();
    			div2_outro = create_out_transition(div2, /*transition*/ ctx[1], /*outOpts*/ ctx[3]);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if (default_slot) default_slot.d(detaching);
    			if (detaching && div2_outro) div2_outro.end();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(20:0) {#if active}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*active*/ ctx[4] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*active*/ ctx[4]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*active*/ 16) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Overlay', slots, ['default']);
    	let { class: klass = '' } = $$props;
    	let { transition = fade } = $$props;
    	let { inOpts = { duration: 250 } } = $$props;
    	let { outOpts = { duration: 250 } } = $$props;
    	let { active = true } = $$props;
    	let { opacity = 0.46 } = $$props;
    	let { color = 'rgb(33, 33, 33)' } = $$props;
    	let { index = 5 } = $$props;
    	let { absolute = false } = $$props;
    	let { style = '' } = $$props;

    	const writable_props = [
    		'class',
    		'transition',
    		'inOpts',
    		'outOpts',
    		'active',
    		'opacity',
    		'color',
    		'index',
    		'absolute',
    		'style'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Overlay> was created with unknown prop '${key}'`);
    	});

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ('class' in $$props) $$invalidate(0, klass = $$props.class);
    		if ('transition' in $$props) $$invalidate(1, transition = $$props.transition);
    		if ('inOpts' in $$props) $$invalidate(2, inOpts = $$props.inOpts);
    		if ('outOpts' in $$props) $$invalidate(3, outOpts = $$props.outOpts);
    		if ('active' in $$props) $$invalidate(4, active = $$props.active);
    		if ('opacity' in $$props) $$invalidate(5, opacity = $$props.opacity);
    		if ('color' in $$props) $$invalidate(6, color = $$props.color);
    		if ('index' in $$props) $$invalidate(7, index = $$props.index);
    		if ('absolute' in $$props) $$invalidate(8, absolute = $$props.absolute);
    		if ('style' in $$props) $$invalidate(9, style = $$props.style);
    		if ('$$scope' in $$props) $$invalidate(10, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		fade,
    		BackgroundColor,
    		klass,
    		transition,
    		inOpts,
    		outOpts,
    		active,
    		opacity,
    		color,
    		index,
    		absolute,
    		style
    	});

    	$$self.$inject_state = $$props => {
    		if ('klass' in $$props) $$invalidate(0, klass = $$props.klass);
    		if ('transition' in $$props) $$invalidate(1, transition = $$props.transition);
    		if ('inOpts' in $$props) $$invalidate(2, inOpts = $$props.inOpts);
    		if ('outOpts' in $$props) $$invalidate(3, outOpts = $$props.outOpts);
    		if ('active' in $$props) $$invalidate(4, active = $$props.active);
    		if ('opacity' in $$props) $$invalidate(5, opacity = $$props.opacity);
    		if ('color' in $$props) $$invalidate(6, color = $$props.color);
    		if ('index' in $$props) $$invalidate(7, index = $$props.index);
    		if ('absolute' in $$props) $$invalidate(8, absolute = $$props.absolute);
    		if ('style' in $$props) $$invalidate(9, style = $$props.style);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		klass,
    		transition,
    		inOpts,
    		outOpts,
    		active,
    		opacity,
    		color,
    		index,
    		absolute,
    		style,
    		$$scope,
    		slots,
    		click_handler
    	];
    }

    class Overlay extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {
    			class: 0,
    			transition: 1,
    			inOpts: 2,
    			outOpts: 3,
    			active: 4,
    			opacity: 5,
    			color: 6,
    			index: 7,
    			absolute: 8,
    			style: 9
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Overlay",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get class() {
    		throw new Error("<Overlay>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Overlay>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get transition() {
    		throw new Error("<Overlay>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set transition(value) {
    		throw new Error("<Overlay>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get inOpts() {
    		throw new Error("<Overlay>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inOpts(value) {
    		throw new Error("<Overlay>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get outOpts() {
    		throw new Error("<Overlay>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set outOpts(value) {
    		throw new Error("<Overlay>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get active() {
    		throw new Error("<Overlay>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set active(value) {
    		throw new Error("<Overlay>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get opacity() {
    		throw new Error("<Overlay>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set opacity(value) {
    		throw new Error("<Overlay>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<Overlay>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Overlay>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get index() {
    		throw new Error("<Overlay>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set index(value) {
    		throw new Error("<Overlay>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get absolute() {
    		throw new Error("<Overlay>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set absolute(value) {
    		throw new Error("<Overlay>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<Overlay>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<Overlay>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const videos = [
        {
            // Mörkt hjärta, 0
            "poster": "https://d2iltjk184xms5.cloudfront.net/uploads/photo/file/428872/5e28517303dbdd80ea40223600cea012-mo_CC_88rkt-hja_CC_88rta_6203c4686743f.jpg",
            "src": "https://drive.google.com/uc?id=1Ugm0-p6I981A2lcERS-7OMs9a7EVPZcO",
        },
        {
            // Aldrig vuxen, 1
            "poster": "https://eu1-prod-images.disco-api.com/2022/03/31/1c686d19-18d4-48de-87e0-249f73ae1776.jpeg?w=400&f=JPG&p=true&q=60",
            "src": "https://drive.google.com/uc?id=1rrgB-KQmfsDD7SVyKkFO2y_bPqnNTytx"
        },
        {
            // Alla mot alla, 2
            "poster": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSoJDQ-VWe3r9li5REUic_wNOtmXPSq4SILdiTcctVWcu46h2fm",
            "src": "https://drive.google.com/uc?id=1WgLxq2S6P59YjomcDcPfRUSmoOIgvn2a"
        },
        {
            // The Island, 3
            "poster": "https://eu1-prod-images.disco-api.com/2022/03/29/52ae4c0f-6f31-38b6-b2fd-5b029dbed6e6.jpeg?w=400&f=JPG&p=true&q=60",
            "src": "https://drive.google.com/uc?id=1e8yTG1Db7iz2Da3BrCFcT5gMrX-t3KKU"
        },
        {
            // Vägens Hjältar, 4
            "poster": "https://eu1-prod-images.disco-api.com/2022/03/09/77cae89f-cc2b-43a8-9b7f-ec2ea6c60c63.jpeg?w=400&f=JPG&p=true&q=60",
            "src": "https://drive.google.com/uc?id=1EI49kyMfB3DBKZcayp8fPFIOtLXid3Xz"
        },
        {
            // Sommaren med släkten, 5
            "poster": "https://eu1-prod-images.disco-api.com/2022/01/21/bf849e10-6a3a-4223-99bc-8d67f67f30eb.jpeg?w=400&f=JPG&p=true&q=60",
            "src": "https://drive.google.com/uc?id=1ndqevcrtoOjrRdNu4RlNBe4QkAVJy_nY"
        },
        {
            // Building off the Grid, 6
            "poster": "https://eu1-prod-images.disco-api.com/2022/05/16/8f283481-3b3f-47e8-b2be-411d6ab20d95.jpeg?w=800&f=JPG&p=true&q=60",
            "src": "https://drive.google.com/uc?id=1cyut1AB17XOPPmsLC562qwLE7MP9V8Wl"
        },
        {
            // Johnny vs. Amber, 7
            "poster": "https://eu1-prod-images.disco-api.com/2022/05/13/f3cef8b8-a64a-32c6-bb74-beb6e70fabfe.jpeg?w=400&f=JPG&p=true&q=60",
            "src": "https://drive.google.com/uc?id=1nrhzJTdScfUzMyBCq92LP7IMELUuHLW3"
        },
        {
            // Huliganfallet, 8
            "poster": "https://eu1-prod-images.disco-api.com/2022/05/09/4ec8f216-3ef1-34ae-b04c-3e85ec81a46a.jpeg?w=800&f=JPG&p=true&q=60"
        },
        {
            // Catching @killer, 9
            "poster": "https://eu1-prod-images.disco-api.com/2022/05/16/6cd3eadf-990d-311b-b037-8636dc64adab.jpeg?w=400&f=JPG&p=true&q=60"
        },
        {
            // My Pack Life, 10
            "poster": "https://eu1-prod-images.disco-api.com/2022/04/30/cf6d21cc-b058-322b-9f85-420e4056a59c.jpeg?w=400&f=JPG&p=true&q=60"
        },
        {
            // The man without a heart, 11
            "poster": "https://eu1-prod-images.disco-api.com/2022/05/03/6dcc2616-00aa-37ed-be0e-a1b59aa8b7a0.jpeg?w=400&f=JPG&p=true&q=60"
        },
        {
            // Invensions, 12
            "poster": "https://eu1-prod-images.disco-api.com/2022/04/20/bf106191-7588-3c13-98be-28da8c20d7f4.jpeg?w=400&f=JPG&p=true&q=60"
        },
        {
            // Kevin Hart, 13
            "poster": "https://eu1-prod-images.disco-api.com/2022/05/13/1d647135-8b33-3c56-92d4-295952a2fbe4.jpeg?w=400&f=JPG&p=true&q=60"
        },
        {
            // Ensam i vildmarken, 14
            "poster": "https://eu1-prod-images.disco-api.com/2021/11/24/b1090980-f226-3b9e-ae97-df34c17b6c0d.jpeg?w=400&f=JPG&p=true&q=60"
        },
        {
            // Över Atlanten, 15
            "poster": "https://eu1-prod-images.disco-api.com/2021/11/24/19203b3a-953f-3d1c-a16e-92b60da9c61a.jpeg?w=400&f=JPG&p=true&q=60"
        },
        {
            // Deadliest Catch, 16
            "poster": "https://eu1-prod-images.disco-api.com/2022/05/17/c4f80db1-26d9-4daa-b98e-ecf89f0a1a53.jpeg?w=400&f=JPG&p=true&q=60"
        },
        {
            // Ed Stafford, 17
            "poster": "https://eu1-prod-images.disco-api.com/2021/11/24/6aafeebb-ec5e-3330-9cc9-79fc4b66a430.jpeg?w=400&f=JPG&p=true&q=60"
        },
        {
            // Everest, 18
            "poster": "https://eu1-prod-images.disco-api.com/2021/11/24/addc8596-54b4-337d-a8d6-94c482bb1465.jpeg?w=400&f=JPG&p=true&q=60"
        },
        {
            // Impossible Row, 19
            "poster": "https://eu1-prod-images.disco-api.com/2021/11/24/6dff37bb-32e8-3b64-8e76-7e7abec949ae.jpeg?w=400&f=JPG&p=true&q=60"
        },
        {
            // Vi i Villa, 20
            "poster": "https://eu1-prod-images.disco-api.com/2022/05/03/f5f3a7fd-047e-3b90-acae-1b907572f2b4.jpeg?w=400&f=JPG&p=true&q=60"
        },
        {
            // Dopamin, 21
            "poster": "https://eu1-prod-images.disco-api.com/2022/04/21/0d2e703c-7db9-3788-be62-fc9c76c58b05.jpeg?w=400&f=JPG&p=true&q=60"
        },
        {
            // LIGGA, 22
            "poster": "https://eu1-prod-images.disco-api.com/2021/12/22/0c83c76d-bfe0-43ae-9c56-1f73aa035229.jpeg?w=400&f=JPG&p=true&q=60"
        },
        {
            // Pappas Pojkar, 23
            "poster": "https://eu1-prod-images.disco-api.com/2021/12/06/eed32bdc-0d35-4a4b-8724-7b7158fcb0e2.jpeg?w=400&f=JPG&p=true&q=60"
        },
        {
            // Udda veckor, 24
            "poster": "https://eu1-prod-images.disco-api.com/2022/03/01/a8c64ce7-008c-4a96-b7de-a3a41601d826.png?w=400&f=JPG&p=true&q=60"
        },
        {
            // Rönnäsfallet, 25
            "poster": "https://eu1-prod-images.disco-api.com/2021/12/01/74d512be-426d-36c8-8d1f-d6b4cf175e1c.jpeg?w=400&f=JPG&p=true&q=60"
        },
        {
            // Ted Bundy, 26
            "poster": "https://eu1-prod-images.disco-api.com/2021/11/23/755c8929-a6c9-39cf-b19e-8661389507a6.jpeg?w=400&f=JPG&p=true&q=60"
        },
        {
            // Insats Torsk, 27
            "poster": "https://eu1-prod-images.disco-api.com/2021/11/24/40f0fb08-f334-378a-adc4-c642f8118852.jpeg?w=400&f=JPG&p=true&q=60"
        },
        {
            // Joakim Lundell, 28
            "poster": "https://eu1-prod-images.disco-api.com/2021/12/01/3573c7d3-b666-3d27-806c-388635ed7805.jpeg?w=400&f=JPG&p=true&q=60"
        },
        {
            // Tunnelbanan, 29
            "poster": "https://eu1-prod-images.disco-api.com/2021/11/24/b6a0e0ab-23ab-36ec-88fb-06f8bed5e25e.jpeg?w=400&f=JPG&p=true&q=60"
        },
        {
            // Murder Tapes, 30
            "poster": "https://eu1-prod-images.disco-api.com/2021/11/24/aab292ba-52ff-3864-bf1c-8a6fbd80ca7c.jpeg?w=400&f=JPG&p=true&q=60"
        },
        {
            // Välkommen till köping, 31
            "poster": "https://eu1-prod-images.disco-api.com/2022/01/26/59683a62-2e15-47f8-9924-de6e84f2e376.jpeg?w=400&f=JPG&p=true&q=60",
            "src": "https://drive.google.com/uc?id=1Ih6Kq-1XAWzfVcOIWJpKKn7AauvRSN0C"
        },
        {
            // Top Gear, 32
            "poster": "https://eu1-prod-images.disco-api.com/2021/12/09/5defb86e-aa15-42ac-a500-0324003e345f.jpeg?w=400&f=JPG&p=true&q=60",
            "src": "https://drive.google.com/uc?id=1KnTmb0YVYEfwa1h9mLnvkLCKR5pEnqpm"
        },
        {
            // Ullared, 33
            "poster": "https://eu1-prod-images.disco-api.com/2021/11/23/44a8e39d-eb1a-3515-b888-c28180e216c8.jpeg?w=400&f=JPG&p=true&q=60",
            "src": "https://drive.google.com/uc?id=1YdEtbEUi5iPihMsJaKEnEU8vJki1HY6r"
        },
        {
            // Calls from the inside, 34
            "poster": "https://eu1-prod-images.disco-api.com/2022/04/04/794f29df-8b04-3c59-a480-a9b7702378dd.jpeg?w=800&f=JPG&p=true&q=60"
        },
        {
            // Building the legend, 35
            "poster": "https://eu1-prod-images.disco-api.com/2022/05/20/661b9c03-7ae3-4c77-b388-3d237928d7db.jpeg?w=400&f=JPG&p=true&q=60"
        },
        {
            // Love in the jungle, 36
            "poster": "https://eu1-prod-images.disco-api.com/2022/05/20/f817b27a-2789-4365-8856-2acf5712cdab.jpeg?w=400&f=JPG&p=true&q=60"
        },
        {
            // Survive that, 37
            "poster": "https://eu1-prod-images.disco-api.com/2021/11/24/affdeabe-3cac-37b6-83c6-1d6ba38e58fc.jpeg?w=400&f=JPG&p=true&q=60"
        },
        {
            // 100 days, 38
            "poster": "https://eu1-prod-images.disco-api.com/2021/11/24/880ff7f2-4de0-3164-aacb-ae6c9dc474b7.jpeg?w=400&f=JPG&p=true&q=60"
        },
        {
            // Puching the line, 39
            "poster": "https://eu1-prod-images.disco-api.com/2021/11/23/983e4734-281c-3cbb-b891-fb0cdef24d79.jpeg?w=400&f=JPG&p=true&q=60"
        }
    ];

    /* src\Player.svelte generated by Svelte v3.48.0 */

    const { isNaN: isNaN_1 } = globals;
    const file$2 = "src\\Player.svelte";

    function create_fragment$2(ctx) {
    	let div2;
    	let video;
    	let track;
    	let video_poster_value;
    	let video_src_value;
    	let video_updating = false;
    	let video_animationframe;
    	let video_is_paused = true;
    	let t0;
    	let div1;
    	let div0;
    	let span0;
    	let t1_value = format(/*time*/ ctx[0]) + "";
    	let t1;
    	let t2;
    	let span2;
    	let span1;
    	let t3_value = format(/*duration*/ ctx[1]) + "";
    	let t3;
    	let t4;
    	let progress;
    	let progress_value_value;
    	let mounted;
    	let dispose;

    	function video_timeupdate_handler() {
    		cancelAnimationFrame(video_animationframe);

    		if (!video.paused) {
    			video_animationframe = raf(video_timeupdate_handler);
    			video_updating = true;
    		}

    		/*video_timeupdate_handler*/ ctx[9].call(video);
    	}

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			video = element("video");
    			track = element("track");
    			t0 = space();
    			div1 = element("div");
    			div0 = element("div");
    			span0 = element("span");
    			t1 = text(t1_value);
    			t2 = space();
    			span2 = element("span");
    			span1 = element("span");
    			t3 = text(t3_value);
    			t4 = space();
    			progress = element("progress");
    			attr_dev(track, "kind", "captions");
    			add_location(track, file$2, 67, 2, 2076);
    			attr_dev(video, "id", "vid");
    			attr_dev(video, "poster", video_poster_value = /*$chosen_video*/ ctx[4].poster);
    			if (!src_url_equal(video.src, video_src_value = /*$chosen_video*/ ctx[4].src)) attr_dev(video, "src", video_src_value);
    			attr_dev(video, "class", "svelte-1o2ni2o");
    			if (/*duration*/ ctx[1] === void 0) add_render_callback(() => /*video_durationchange_handler*/ ctx[10].call(video));
    			add_location(video, file$2, 57, 1, 1805);
    			attr_dev(span0, "class", "time svelte-1o2ni2o");
    			add_location(span0, file$2, 79, 3, 2465);
    			attr_dev(span1, "class", "time svelte-1o2ni2o");
    			add_location(span1, file$2, 81, 4, 2522);
    			attr_dev(span2, "class", "svelte-1o2ni2o");
    			add_location(span2, file$2, 80, 3, 2510);
    			attr_dev(div0, "class", "info svelte-1o2ni2o");
    			add_location(div0, file$2, 78, 2, 2442);
    			progress.value = progress_value_value = /*time*/ ctx[0] / /*duration*/ ctx[1] || 0;
    			attr_dev(progress, "class", "svelte-1o2ni2o");
    			add_location(progress, file$2, 84, 2, 2592);
    			attr_dev(div1, "class", "controls svelte-1o2ni2o");
    			set_style(div1, "opacity", /*duration*/ ctx[1] && /*showControls*/ ctx[3] ? 1 : 0);
    			add_location(div1, file$2, 70, 1, 2117);
    			attr_dev(div2, "id", "container");
    			attr_dev(div2, "class", "svelte-1o2ni2o");
    			add_location(div2, file$2, 56, 0, 1782);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, video);
    			append_dev(video, track);
    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			append_dev(div0, span0);
    			append_dev(span0, t1);
    			append_dev(div0, t2);
    			append_dev(div0, span2);
    			append_dev(span2, span1);
    			append_dev(span1, t3);
    			append_dev(div1, t4);
    			append_dev(div1, progress);

    			if (!mounted) {
    				dispose = [
    					listen_dev(window, "keydown", prevent_default(/*handleKeyDown*/ ctx[8]), false, true, false),
    					listen_dev(video, "mousedown", stop_propagation(prevent_default(/*handleMousedown*/ ctx[6])), false, true, true),
    					listen_dev(video, "mouseup", stop_propagation(prevent_default(/*handleMouseup*/ ctx[7])), false, true, true),
    					listen_dev(video, "timeupdate", video_timeupdate_handler),
    					listen_dev(video, "durationchange", /*video_durationchange_handler*/ ctx[10]),
    					listen_dev(video, "play", /*video_play_pause_handler*/ ctx[11]),
    					listen_dev(video, "pause", /*video_play_pause_handler*/ ctx[11]),
    					listen_dev(div1, "mousemove", stop_propagation(prevent_default(/*handleMove*/ ctx[5])), false, true, true),
    					listen_dev(div1, "touchmove", stop_propagation(prevent_default(/*handleMove*/ ctx[5])), false, true, true),
    					listen_dev(div1, "mousedown", stop_propagation(prevent_default(/*handleMove*/ ctx[5])), false, true, true),
    					listen_dev(div1, "mouseup", stop_propagation(prevent_default(/*handleMove*/ ctx[5])), false, true, true)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$chosen_video*/ 16 && video_poster_value !== (video_poster_value = /*$chosen_video*/ ctx[4].poster)) {
    				attr_dev(video, "poster", video_poster_value);
    			}

    			if (dirty & /*$chosen_video*/ 16 && !src_url_equal(video.src, video_src_value = /*$chosen_video*/ ctx[4].src)) {
    				attr_dev(video, "src", video_src_value);
    			}

    			if (!video_updating && dirty & /*time*/ 1 && !isNaN_1(/*time*/ ctx[0])) {
    				video.currentTime = /*time*/ ctx[0];
    			}

    			video_updating = false;

    			if (dirty & /*paused*/ 4 && video_is_paused !== (video_is_paused = /*paused*/ ctx[2])) {
    				video[video_is_paused ? "pause" : "play"]();
    			}

    			if (dirty & /*time*/ 1 && t1_value !== (t1_value = format(/*time*/ ctx[0]) + "")) set_data_dev(t1, t1_value);
    			if (dirty & /*duration*/ 2 && t3_value !== (t3_value = format(/*duration*/ ctx[1]) + "")) set_data_dev(t3, t3_value);

    			if (dirty & /*time, duration*/ 3 && progress_value_value !== (progress_value_value = /*time*/ ctx[0] / /*duration*/ ctx[1] || 0)) {
    				prop_dev(progress, "value", progress_value_value);
    			}

    			if (dirty & /*duration, showControls*/ 10) {
    				set_style(div1, "opacity", /*duration*/ ctx[1] && /*showControls*/ ctx[3] ? 1 : 0);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function format(seconds) {
    	if (isNaN(seconds)) return "...";
    	const minutes = Math.floor(seconds / 60);
    	seconds = Math.floor(seconds % 60);
    	if (seconds < 10) seconds = "0" + seconds;
    	return `${minutes}:${seconds}`;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let $chosen_video;
    	validate_store(chosen_video, 'chosen_video');
    	component_subscribe($$self, chosen_video, $$value => $$invalidate(4, $chosen_video = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Player', slots, []);
    	let time = 0;
    	let duration;
    	let paused = true;
    	let showControls = true;
    	let showControlsTimeout;

    	// Used to track time of last mouse down event
    	let lastMouseDown;

    	function handleMove(e) {
    		// Make the controls visible, but fade out after
    		// 2.5 seconds of inactivity
    		clearTimeout(showControlsTimeout);

    		showControlsTimeout = setTimeout(() => $$invalidate(3, showControls = false), 2500);
    		$$invalidate(3, showControls = true);
    		if (!duration) return; // video not loaded yet
    		if (e.type !== "touchmove" && !(e.buttons & 1)) return; // mouse not down

    		const clientX = e.type === "touchmove"
    		? e.touches[0].clientX
    		: e.clientX;

    		const { left, right } = this.getBoundingClientRect();
    		$$invalidate(0, time = duration * (clientX - left) / (right - left));
    	}

    	// we can't rely on the built-in click event, because it fires
    	// after a drag — we have to listen for clicks ourselves
    	function handleMousedown(e) {
    		lastMouseDown = new Date();
    	}

    	function handleMouseup(e) {
    		if (new Date() - lastMouseDown < 300) {
    			if (paused) e.target.play(); else e.target.pause();
    		}
    	}

    	function handleKeyDown(e) {
    		let video = document.getElementById("vid");

    		if (e && e.key == " ") {
    			if (paused) video.play(); else video.pause();
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Player> was created with unknown prop '${key}'`);
    	});

    	function video_timeupdate_handler() {
    		time = this.currentTime;
    		$$invalidate(0, time);
    	}

    	function video_durationchange_handler() {
    		duration = this.duration;
    		$$invalidate(1, duration);
    	}

    	function video_play_pause_handler() {
    		paused = this.paused;
    		$$invalidate(2, paused);
    	}

    	$$self.$capture_state = () => ({
    		chosen_video,
    		time,
    		duration,
    		paused,
    		showControls,
    		showControlsTimeout,
    		lastMouseDown,
    		handleMove,
    		handleMousedown,
    		handleMouseup,
    		handleKeyDown,
    		format,
    		$chosen_video
    	});

    	$$self.$inject_state = $$props => {
    		if ('time' in $$props) $$invalidate(0, time = $$props.time);
    		if ('duration' in $$props) $$invalidate(1, duration = $$props.duration);
    		if ('paused' in $$props) $$invalidate(2, paused = $$props.paused);
    		if ('showControls' in $$props) $$invalidate(3, showControls = $$props.showControls);
    		if ('showControlsTimeout' in $$props) showControlsTimeout = $$props.showControlsTimeout;
    		if ('lastMouseDown' in $$props) lastMouseDown = $$props.lastMouseDown;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		time,
    		duration,
    		paused,
    		showControls,
    		$chosen_video,
    		handleMove,
    		handleMousedown,
    		handleMouseup,
    		handleKeyDown,
    		video_timeupdate_handler,
    		video_durationchange_handler,
    		video_play_pause_handler
    	];
    }

    class Player extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Player",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src\Thumbnail.svelte generated by Svelte v3.48.0 */
    const file$1 = "src\\Thumbnail.svelte";

    function create_fragment$1(ctx) {
    	let div1;
    	let div0;
    	let p;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			p = element("p");
    			p.textContent = "Press To Play";
    			attr_dev(p, "class", "svelte-1vjrk5g");
    			add_location(p, file$1, 14, 19, 300);
    			attr_dev(div0, "class", "hover svelte-1vjrk5g");
    			add_location(div0, file$1, 14, 0, 281);
    			attr_dev(div1, "class", "grid-item svelte-1vjrk5g");
    			set_style(div1, "background-image", "url(" + /*video*/ ctx[0].poster + ")");
    			add_location(div1, file$1, 5, 0, 119);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, p);

    			if (!mounted) {
    				dispose = listen_dev(div1, "click", /*click_handler*/ ctx[3], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*video*/ 1) {
    				set_style(div1, "background-image", "url(" + /*video*/ ctx[0].poster + ")");
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let $chosen_video;
    	let $video_player_is_active;
    	validate_store(chosen_video, 'chosen_video');
    	component_subscribe($$self, chosen_video, $$value => $$invalidate(1, $chosen_video = $$value));
    	validate_store(video_player_is_active, 'video_player_is_active');
    	component_subscribe($$self, video_player_is_active, $$value => $$invalidate(2, $video_player_is_active = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Thumbnail', slots, []);
    	let { video } = $$props;
    	const writable_props = ['video'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Thumbnail> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => {
    		set_store_value(chosen_video, $chosen_video = video, $chosen_video);
    		set_store_value(video_player_is_active, $video_player_is_active = true, $video_player_is_active);
    	};

    	$$self.$$set = $$props => {
    		if ('video' in $$props) $$invalidate(0, video = $$props.video);
    	};

    	$$self.$capture_state = () => ({
    		video,
    		chosen_video,
    		video_player_is_active,
    		$chosen_video,
    		$video_player_is_active
    	});

    	$$self.$inject_state = $$props => {
    		if ('video' in $$props) $$invalidate(0, video = $$props.video);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [video, $chosen_video, $video_player_is_active, click_handler];
    }

    class Thumbnail extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { video: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Thumbnail",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*video*/ ctx[0] === undefined && !('video' in props)) {
    			console.warn("<Thumbnail> was created without expected prop 'video'");
    		}
    	}

    	get video() {
    		throw new Error("<Thumbnail>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set video(value) {
    		throw new Error("<Thumbnail>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\App.svelte generated by Svelte v3.48.0 */
    const file = "src\\App.svelte";

    // (343:4) <Button    class="error-color"    size="small"    on:click={() => {      $video_player_is_active = false;      visibility = true;    }}     >
    function create_default_slot_3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Close");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(343:4) <Button    class=\\\"error-color\\\"    size=\\\"small\\\"    on:click={() => {      $video_player_is_active = false;      visibility = true;    }}     >",
    		ctx
    	});

    	return block;
    }

    // (355:4) <Button    size="small"    class="primary-color"    on:click={() => {      is_fullscreen = !is_fullscreen;      // do not focus the fullscreenbutton if clicked      // this is because otherwise clicking space will cause      // the video player to maximize/minimize instead of pause/play      // when space is clicked      if (document.activeElement != document.body)     document.activeElement.blur();    }}     >
    function create_default_slot_2(ctx) {
    	let t_value = (/*is_fullscreen*/ ctx[0] ? "Minimize" : "Theatre Mode") + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*is_fullscreen*/ 1 && t_value !== (t_value = (/*is_fullscreen*/ ctx[0] ? "Minimize" : "Theatre Mode") + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(355:4) <Button    size=\\\"small\\\"    class=\\\"primary-color\\\"    on:click={() => {      is_fullscreen = !is_fullscreen;      // do not focus the fullscreenbutton if clicked      // this is because otherwise clicking space will cause      // the video player to maximize/minimize instead of pause/play      // when space is clicked      if (document.activeElement != document.body)     document.activeElement.blur();    }}     >",
    		ctx
    	});

    	return block;
    }

    // (372:2) {#if is_fullscreen}
    function create_if_block(ctx) {
    	let div;
    	let button;
    	let current;

    	button = new Button({
    			props: {
    				size: "small",
    				class: "secondary-color",
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*click_handler_8*/ ctx[28]);

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(button.$$.fragment);
    			attr_dev(div, "id", "gigascreen");
    			attr_dev(div, "class", "svelte-zdav59");
    			add_location(div, file, 372, 4, 16432);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(button, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 1073741824) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(372:2) {#if is_fullscreen}",
    		ctx
    	});

    	return block;
    }

    // (374:3) <Button      size="small"      class="secondary-color"      on:click={() => {     // do not focus the fullscreenbutton if clicked     // this is because otherwise clicking space will cause     // the video player to maximize/minimize instead of pause/play     // when space is clicked     if (document.activeElement != document.body)       document.activeElement.blur();        let div = document.getElementById("vid");     if (div.requestFullscreen) div.requestFullscreen();     else if (div.webkitRequestFullscreen)       div.webkitRequestFullscreen();     else if (div.msRequestFullScreen) div.msRequestFullScreen();      }}    >
    function create_default_slot_1(ctx) {
    	let t_value = "Gigascreen" + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(374:3) <Button      size=\\\"small\\\"      class=\\\"secondary-color\\\"      on:click={() => {     // do not focus the fullscreenbutton if clicked     // this is because otherwise clicking space will cause     // the video player to maximize/minimize instead of pause/play     // when space is clicked     if (document.activeElement != document.body)       document.activeElement.blur();        let div = document.getElementById(\\\"vid\\\");     if (div.requestFullscreen) div.requestFullscreen();     else if (div.webkitRequestFullscreen)       div.webkitRequestFullscreen();     else if (div.msRequestFullScreen) div.msRequestFullScreen();      }}    >",
    		ctx
    	});

    	return block;
    }

    // (327:1) <Overlay    opacity={is_fullscreen ? 1 : 0.7}    color="black"    active={$video_player_is_active}    on:click={() => {   $video_player_is_active = false;    }}  >
    function create_default_slot(ctx) {
    	let div2;
    	let div0;
    	let button0;
    	let t0;
    	let div1;
    	let button1;
    	let t1;
    	let t2;
    	let player;
    	let current;
    	let mounted;
    	let dispose;

    	button0 = new Button({
    			props: {
    				class: "error-color",
    				size: "small",
    				$$slots: { default: [create_default_slot_3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button0.$on("click", /*click_handler_6*/ ctx[26]);

    	button1 = new Button({
    			props: {
    				size: "small",
    				class: "primary-color",
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1.$on("click", /*click_handler_7*/ ctx[27]);
    	let if_block = /*is_fullscreen*/ ctx[0] && create_if_block(ctx);
    	player = new Player({ $$inline: true });

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			create_component(button0.$$.fragment);
    			t0 = space();
    			div1 = element("div");
    			create_component(button1.$$.fragment);
    			t1 = space();
    			if (if_block) if_block.c();
    			t2 = space();
    			create_component(player.$$.fragment);
    			attr_dev(div0, "id", "close");
    			attr_dev(div0, "class", "svelte-zdav59");
    			add_location(div0, file, 341, 2, 15693);
    			attr_dev(div1, "id", "fullscreen");
    			attr_dev(div1, "class", "svelte-zdav59");
    			add_location(div1, file, 353, 2, 15890);
    			attr_dev(div2, "id", "video");
    			attr_dev(div2, "class", "svelte-zdav59");
    			toggle_class(div2, "fullscreen", /*is_fullscreen*/ ctx[0] == true);
    			add_location(div2, file, 334, 3, 15574);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			mount_component(button0, div0, null);
    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			mount_component(button1, div1, null);
    			append_dev(div2, t1);
    			if (if_block) if_block.m(div2, null);
    			append_dev(div2, t2);
    			mount_component(player, div2, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div2, "click", click_handler_9, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			const button0_changes = {};

    			if (dirty & /*$$scope*/ 1073741824) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};

    			if (dirty & /*$$scope, is_fullscreen*/ 1073741825) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);

    			if (/*is_fullscreen*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*is_fullscreen*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div2, t2);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (dirty & /*is_fullscreen*/ 1) {
    				toggle_class(div2, "fullscreen", /*is_fullscreen*/ ctx[0] == true);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			transition_in(if_block);
    			transition_in(player.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			transition_out(if_block);
    			transition_out(player.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			destroy_component(button0);
    			destroy_component(button1);
    			if (if_block) if_block.d();
    			destroy_component(player);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(327:1) <Overlay    opacity={is_fullscreen ? 1 : 0.7}    color=\\\"black\\\"    active={$video_player_is_active}    on:click={() => {   $video_player_is_active = false;    }}  >",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let link;
    	let t0;
    	let main;
    	let h1;
    	let img0;
    	let img0_src_value;
    	let t1;
    	let t2;
    	let div0;
    	let t3;
    	let button0;
    	let t5;
    	let button1;
    	let t7;
    	let button2;
    	let t9;
    	let button3;
    	let t11;
    	let div1;
    	let t10_1;
    	let t13;
    	let div22;
    	let div3;
    	let thumbnail0;
    	let t14;
    	let div2;
    	let t15;
    	let img1;
    	let img1_src_value;
    	let t16;
    	let div5;
    	let thumbnail1;
    	let t17;
    	let div4;
    	let t18;
    	let img2;
    	let img2_src_value;
    	let t19;
    	let div7;
    	let thumbnail2;
    	let t20;
    	let div6;
    	let t21;
    	let img3;
    	let img3_src_value;
    	let br0;
    	let t22;
    	let t23;
    	let div9;
    	let thumbnail3;
    	let t24;
    	let div8;
    	let t25;
    	let img4;
    	let img4_src_value;
    	let t26;
    	let div11;
    	let thumbnail4;
    	let t27;
    	let div10;
    	let t28;
    	let img5;
    	let img5_src_value;
    	let t29;
    	let div13;
    	let thumbnail5;
    	let t30;
    	let div12;
    	let t31;
    	let img6;
    	let img6_src_value;
    	let br1;
    	let t32;
    	let t33;
    	let div15;
    	let thumbnail6;
    	let t34;
    	let div14;
    	let t35;
    	let img7;
    	let img7_src_value;
    	let br2;
    	let t36;
    	let t37;
    	let div17;
    	let thumbnail7;
    	let t38;
    	let div16;
    	let t39;
    	let img8;
    	let img8_src_value;
    	let br3;
    	let t40;
    	let t41;
    	let div19;
    	let thumbnail8;
    	let t42;
    	let div18;
    	let t43;
    	let img9;
    	let img9_src_value;
    	let t44;
    	let div21;
    	let thumbnail9;
    	let t45;
    	let div20;
    	let t46;
    	let img10;
    	let img10_src_value;
    	let t47;
    	let div23;
    	let t11_1;
    	let t49;
    	let div44;
    	let div25;
    	let thumbnail10;
    	let t50;
    	let div24;
    	let t51;
    	let img11;
    	let img11_src_value;
    	let br4;
    	let t52;
    	let t53;
    	let div27;
    	let thumbnail11;
    	let t54;
    	let div26;
    	let t55;
    	let img12;
    	let img12_src_value;
    	let br5;
    	let t56;
    	let t57;
    	let div29;
    	let thumbnail12;
    	let t58;
    	let div28;
    	let t59;
    	let img13;
    	let img13_src_value;
    	let t60;
    	let div31;
    	let thumbnail13;
    	let t61;
    	let div30;
    	let t62;
    	let img14;
    	let img14_src_value;
    	let t63;
    	let div33;
    	let thumbnail14;
    	let t64;
    	let div32;
    	let t65;
    	let img15;
    	let img15_src_value;
    	let br6;
    	let t66;
    	let t67;
    	let div35;
    	let thumbnail15;
    	let t68;
    	let div34;
    	let t69;
    	let img16;
    	let img16_src_value;
    	let br7;
    	let t70;
    	let t71;
    	let div37;
    	let thumbnail16;
    	let t72;
    	let div36;
    	let t73;
    	let img17;
    	let img17_src_value;
    	let br8;
    	let t74;
    	let t75;
    	let div39;
    	let thumbnail17;
    	let t76;
    	let div38;
    	let t77;
    	let img18;
    	let img18_src_value;
    	let br9;
    	let t78;
    	let t79;
    	let div41;
    	let thumbnail18;
    	let t80;
    	let div40;
    	let t81;
    	let img19;
    	let img19_src_value;
    	let br10;
    	let t82;
    	let t83;
    	let div43;
    	let thumbnail19;
    	let t84;
    	let div42;
    	let t85;
    	let img20;
    	let img20_src_value;
    	let br11;
    	let t86;
    	let t87;
    	let div45;
    	let t12_1;
    	let t89;
    	let div66;
    	let div47;
    	let thumbnail20;
    	let t90;
    	let div46;
    	let t91;
    	let img21;
    	let img21_src_value;
    	let t92;
    	let div49;
    	let thumbnail21;
    	let t93;
    	let div48;
    	let t94;
    	let img22;
    	let img22_src_value;
    	let t95;
    	let div51;
    	let thumbnail22;
    	let t96;
    	let div50;
    	let t97;
    	let img23;
    	let img23_src_value;
    	let t98;
    	let div53;
    	let thumbnail23;
    	let t99;
    	let div52;
    	let t100;
    	let img24;
    	let img24_src_value;
    	let t101;
    	let div55;
    	let thumbnail24;
    	let t102;
    	let div54;
    	let t103;
    	let img25;
    	let img25_src_value;
    	let br12;
    	let t104;
    	let t105;
    	let div57;
    	let thumbnail25;
    	let t106;
    	let div56;
    	let t107;
    	let img26;
    	let img26_src_value;
    	let br13;
    	let t108;
    	let t109;
    	let div59;
    	let thumbnail26;
    	let t110;
    	let div58;
    	let t111;
    	let img27;
    	let img27_src_value;
    	let t112;
    	let div61;
    	let thumbnail27;
    	let t113;
    	let div60;
    	let t114;
    	let img28;
    	let img28_src_value;
    	let t115;
    	let div63;
    	let thumbnail28;
    	let t116;
    	let div62;
    	let t117;
    	let img29;
    	let img29_src_value;
    	let t118;
    	let div65;
    	let thumbnail29;
    	let t119;
    	let div64;
    	let t120;
    	let img30;
    	let img30_src_value;
    	let t121;
    	let div69;
    	let button4;
    	let img31;
    	let img31_src_value;
    	let t122;
    	let button5;
    	let img32;
    	let img32_src_value;
    	let t123;
    	let button6;
    	let t124;
    	let t125;
    	let div67;
    	let img33;
    	let img33_src_value;
    	let t126;
    	let img34;
    	let img34_src_value;
    	let t127;
    	let button7;
    	let t128;
    	let t129;
    	let div68;
    	let img35;
    	let img35_src_value;
    	let t130;
    	let img36;
    	let img36_src_value;
    	let t131;
    	let div70;
    	let t13_1;
    	let t133;
    	let div91;
    	let div72;
    	let thumbnail30;
    	let t134;
    	let div71;
    	let t135;
    	let img37;
    	let img37_src_value;
    	let t136;
    	let div74;
    	let thumbnail31;
    	let t137;
    	let div73;
    	let t138;
    	let img38;
    	let img38_src_value;
    	let t139;
    	let div76;
    	let thumbnail32;
    	let t140;
    	let div75;
    	let t141;
    	let img39;
    	let img39_src_value;
    	let t142;
    	let div78;
    	let thumbnail33;
    	let t143;
    	let div77;
    	let t144;
    	let img40;
    	let img40_src_value;
    	let br14;
    	let t145;
    	let t146;
    	let div80;
    	let thumbnail34;
    	let t147;
    	let div79;
    	let t148;
    	let img41;
    	let img41_src_value;
    	let br15;
    	let t149;
    	let t150;
    	let div82;
    	let thumbnail35;
    	let t151;
    	let div81;
    	let t152;
    	let img42;
    	let img42_src_value;
    	let br16;
    	let t153;
    	let t154;
    	let div84;
    	let thumbnail36;
    	let t155;
    	let div83;
    	let t156;
    	let img43;
    	let img43_src_value;
    	let t157;
    	let div86;
    	let thumbnail37;
    	let t158;
    	let div85;
    	let t159;
    	let img44;
    	let img44_src_value;
    	let br17;
    	let t160;
    	let t161;
    	let div88;
    	let thumbnail38;
    	let t162;
    	let div87;
    	let t163;
    	let img45;
    	let img45_src_value;
    	let t164;
    	let div90;
    	let thumbnail39;
    	let t165;
    	let div89;
    	let t166;
    	let img46;
    	let img46_src_value;
    	let br18;
    	let t167;
    	let t168;
    	let div92;
    	let t14_1;
    	let t170;
    	let div113;
    	let div94;
    	let thumbnail40;
    	let t171;
    	let div93;
    	let t172;
    	let img47;
    	let img47_src_value;
    	let br19;
    	let t173;
    	let t174;
    	let div96;
    	let thumbnail41;
    	let t175;
    	let div95;
    	let t176;
    	let img48;
    	let img48_src_value;
    	let br20;
    	let t177;
    	let t178;
    	let div98;
    	let thumbnail42;
    	let t179;
    	let div97;
    	let t180;
    	let img49;
    	let img49_src_value;
    	let br21;
    	let t181;
    	let t182;
    	let div100;
    	let thumbnail43;
    	let t183;
    	let div99;
    	let t184;
    	let img50;
    	let img50_src_value;
    	let br22;
    	let t185;
    	let t186;
    	let div102;
    	let thumbnail44;
    	let t187;
    	let div101;
    	let t188;
    	let img51;
    	let img51_src_value;
    	let t189;
    	let div104;
    	let thumbnail45;
    	let t190;
    	let div103;
    	let t191;
    	let img52;
    	let img52_src_value;
    	let t192;
    	let div106;
    	let thumbnail46;
    	let t193;
    	let div105;
    	let t194;
    	let img53;
    	let img53_src_value;
    	let t195;
    	let div108;
    	let thumbnail47;
    	let t196;
    	let div107;
    	let t197;
    	let img54;
    	let img54_src_value;
    	let br23;
    	let t198;
    	let t199;
    	let div110;
    	let thumbnail48;
    	let t200;
    	let div109;
    	let t201;
    	let img55;
    	let img55_src_value;
    	let t202;
    	let div112;
    	let thumbnail49;
    	let t203;
    	let div111;
    	let t204;
    	let img56;
    	let img56_src_value;
    	let t205;
    	let overlay;
    	let t206;
    	let src;
    	let current;
    	let mounted;
    	let dispose;

    	thumbnail0 = new Thumbnail({
    			props: { video: videos[0] },
    			$$inline: true
    		});

    	thumbnail1 = new Thumbnail({
    			props: { video: videos[1] },
    			$$inline: true
    		});

    	thumbnail2 = new Thumbnail({
    			props: { video: videos[2] },
    			$$inline: true
    		});

    	thumbnail3 = new Thumbnail({
    			props: { video: videos[3] },
    			$$inline: true
    		});

    	thumbnail4 = new Thumbnail({
    			props: { video: videos[4] },
    			$$inline: true
    		});

    	thumbnail5 = new Thumbnail({
    			props: { video: videos[5] },
    			$$inline: true
    		});

    	thumbnail6 = new Thumbnail({
    			props: { video: videos[6] },
    			$$inline: true
    		});

    	thumbnail7 = new Thumbnail({
    			props: { video: videos[31] },
    			$$inline: true
    		});

    	thumbnail8 = new Thumbnail({
    			props: { video: videos[32] },
    			$$inline: true
    		});

    	thumbnail9 = new Thumbnail({
    			props: { video: videos[33] },
    			$$inline: true
    		});

    	thumbnail10 = new Thumbnail({
    			props: { video: videos[7] },
    			$$inline: true
    		});

    	thumbnail11 = new Thumbnail({
    			props: { video: videos[8] },
    			$$inline: true
    		});

    	thumbnail12 = new Thumbnail({
    			props: { video: videos[9] },
    			$$inline: true
    		});

    	thumbnail13 = new Thumbnail({
    			props: { video: videos[10] },
    			$$inline: true
    		});

    	thumbnail14 = new Thumbnail({
    			props: { video: videos[11] },
    			$$inline: true
    		});

    	thumbnail15 = new Thumbnail({
    			props: { video: videos[12] },
    			$$inline: true
    		});

    	thumbnail16 = new Thumbnail({
    			props: { video: videos[13] },
    			$$inline: true
    		});

    	thumbnail17 = new Thumbnail({
    			props: { video: videos[34] },
    			$$inline: true
    		});

    	thumbnail18 = new Thumbnail({
    			props: { video: videos[35] },
    			$$inline: true
    		});

    	thumbnail19 = new Thumbnail({
    			props: { video: videos[36] },
    			$$inline: true
    		});

    	thumbnail20 = new Thumbnail({
    			props: { video: videos[3] },
    			$$inline: true
    		});

    	thumbnail21 = new Thumbnail({
    			props: { video: videos[14] },
    			$$inline: true
    		});

    	thumbnail22 = new Thumbnail({
    			props: { video: videos[15] },
    			$$inline: true
    		});

    	thumbnail23 = new Thumbnail({
    			props: { video: videos[16] },
    			$$inline: true
    		});

    	thumbnail24 = new Thumbnail({
    			props: { video: videos[17] },
    			$$inline: true
    		});

    	thumbnail25 = new Thumbnail({
    			props: { video: videos[18] },
    			$$inline: true
    		});

    	thumbnail26 = new Thumbnail({
    			props: { video: videos[19] },
    			$$inline: true
    		});

    	thumbnail27 = new Thumbnail({
    			props: { video: videos[37] },
    			$$inline: true
    		});

    	thumbnail28 = new Thumbnail({
    			props: { video: videos[38] },
    			$$inline: true
    		});

    	thumbnail29 = new Thumbnail({
    			props: { video: videos[39] },
    			$$inline: true
    		});

    	thumbnail30 = new Thumbnail({
    			props: { video: videos[20] },
    			$$inline: true
    		});

    	thumbnail31 = new Thumbnail({
    			props: { video: videos[21] },
    			$$inline: true
    		});

    	thumbnail32 = new Thumbnail({
    			props: { video: videos[0] },
    			$$inline: true
    		});

    	thumbnail33 = new Thumbnail({
    			props: { video: videos[5] },
    			$$inline: true
    		});

    	thumbnail34 = new Thumbnail({
    			props: { video: videos[22] },
    			$$inline: true
    		});

    	thumbnail35 = new Thumbnail({
    			props: { video: videos[23] },
    			$$inline: true
    		});

    	thumbnail36 = new Thumbnail({
    			props: { video: videos[24] },
    			$$inline: true
    		});

    	thumbnail37 = new Thumbnail({
    			props: { video: videos[2] },
    			$$inline: true
    		});

    	thumbnail38 = new Thumbnail({
    			props: { video: videos[3] },
    			$$inline: true
    		});

    	thumbnail39 = new Thumbnail({
    			props: { video: videos[5] },
    			$$inline: true
    		});

    	thumbnail40 = new Thumbnail({
    			props: { video: videos[25] },
    			$$inline: true
    		});

    	thumbnail41 = new Thumbnail({
    			props: { video: videos[26] },
    			$$inline: true
    		});

    	thumbnail42 = new Thumbnail({
    			props: { video: videos[27] },
    			$$inline: true
    		});

    	thumbnail43 = new Thumbnail({
    			props: { video: videos[28] },
    			$$inline: true
    		});

    	thumbnail44 = new Thumbnail({
    			props: { video: videos[29] },
    			$$inline: true
    		});

    	thumbnail45 = new Thumbnail({
    			props: { video: videos[4] },
    			$$inline: true
    		});

    	thumbnail46 = new Thumbnail({
    			props: { video: videos[30] },
    			$$inline: true
    		});

    	thumbnail47 = new Thumbnail({
    			props: { video: videos[17] },
    			$$inline: true
    		});

    	thumbnail48 = new Thumbnail({
    			props: { video: videos[38] },
    			$$inline: true
    		});

    	thumbnail49 = new Thumbnail({
    			props: { video: videos[37] },
    			$$inline: true
    		});

    	overlay = new Overlay({
    			props: {
    				opacity: /*is_fullscreen*/ ctx[0] ? 1 : 0.7,
    				color: "black",
    				active: /*$video_player_is_active*/ ctx[10],
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	overlay.$on("click", /*click_handler_10*/ ctx[29]);

    	const block = {
    		c: function create() {
    			link = element("link");
    			t0 = space();
    			main = element("main");
    			h1 = element("h1");
    			img0 = element("img");
    			t1 = text("discovery-");
    			t2 = space();
    			div0 = element("div");
    			t3 = space();
    			button0 = element("button");
    			button0.textContent = "Dokumentärer";
    			t5 = space();
    			button1 = element("button");
    			button1.textContent = "Nyheter";
    			t7 = space();
    			button2 = element("button");
    			button2.textContent = "Serier";
    			t9 = space();
    			button3 = element("button");
    			button3.textContent = "Din Sida";
    			t11 = space();
    			div1 = element("div");
    			t10_1 = element("t1");
    			t10_1.textContent = "Utvalt";
    			t13 = space();
    			div22 = element("div");
    			div3 = element("div");
    			create_component(thumbnail0.$$.fragment);
    			t14 = space();
    			div2 = element("div");
    			t15 = text("Mörkt hjärta");
    			img1 = element("img");
    			t16 = space();
    			div5 = element("div");
    			create_component(thumbnail1.$$.fragment);
    			t17 = space();
    			div4 = element("div");
    			t18 = text("Aldrig vuxen");
    			img2 = element("img");
    			t19 = space();
    			div7 = element("div");
    			create_component(thumbnail2.$$.fragment);
    			t20 = space();
    			div6 = element("div");
    			t21 = text("Alla mot alla med ");
    			img3 = element("img");
    			br0 = element("br");
    			t22 = text("Filip och Fredrik");
    			t23 = space();
    			div9 = element("div");
    			create_component(thumbnail3.$$.fragment);
    			t24 = space();
    			div8 = element("div");
    			t25 = text("The Island Sverige");
    			img4 = element("img");
    			t26 = space();
    			div11 = element("div");
    			create_component(thumbnail4.$$.fragment);
    			t27 = space();
    			div10 = element("div");
    			t28 = text("Vägens Hjältar");
    			img5 = element("img");
    			t29 = space();
    			div13 = element("div");
    			create_component(thumbnail5.$$.fragment);
    			t30 = space();
    			div12 = element("div");
    			t31 = text("Sommaren med");
    			img6 = element("img");
    			br1 = element("br");
    			t32 = text("släkten");
    			t33 = space();
    			div15 = element("div");
    			create_component(thumbnail6.$$.fragment);
    			t34 = space();
    			div14 = element("div");
    			t35 = text("Building Off The");
    			img7 = element("img");
    			br2 = element("br");
    			t36 = text("Grid");
    			t37 = space();
    			div17 = element("div");
    			create_component(thumbnail7.$$.fragment);
    			t38 = space();
    			div16 = element("div");
    			t39 = text("Välkommen Till");
    			img8 = element("img");
    			br3 = element("br");
    			t40 = text("Köping");
    			t41 = space();
    			div19 = element("div");
    			create_component(thumbnail8.$$.fragment);
    			t42 = space();
    			div18 = element("div");
    			t43 = text("Top Gear");
    			img9 = element("img");
    			t44 = space();
    			div21 = element("div");
    			create_component(thumbnail9.$$.fragment);
    			t45 = space();
    			div20 = element("div");
    			t46 = text("Ullared");
    			img10 = element("img");
    			t47 = space();
    			div23 = element("div");
    			t11_1 = element("t1");
    			t11_1.textContent = "Nytt på discovery-";
    			t49 = space();
    			div44 = element("div");
    			div25 = element("div");
    			create_component(thumbnail10.$$.fragment);
    			t50 = space();
    			div24 = element("div");
    			t51 = text("Johnny vs.");
    			img11 = element("img");
    			br4 = element("br");
    			t52 = text("Amber");
    			t53 = space();
    			div27 = element("div");
    			create_component(thumbnail11.$$.fragment);
    			t54 = space();
    			div26 = element("div");
    			t55 = text("Huliganfallet - hotad");
    			img12 = element("img");
    			br5 = element("br");
    			t56 = text("till tystnad");
    			t57 = space();
    			div29 = element("div");
    			create_component(thumbnail12.$$.fragment);
    			t58 = space();
    			div28 = element("div");
    			t59 = text("Catching @killer");
    			img13 = element("img");
    			t60 = space();
    			div31 = element("div");
    			create_component(thumbnail13.$$.fragment);
    			t61 = space();
    			div30 = element("div");
    			t62 = text("My Pack Life");
    			img14 = element("img");
    			t63 = space();
    			div33 = element("div");
    			create_component(thumbnail14.$$.fragment);
    			t64 = space();
    			div32 = element("div");
    			t65 = text("The Man Without A");
    			img15 = element("img");
    			br6 = element("br");
    			t66 = text("Heart");
    			t67 = space();
    			div35 = element("div");
    			create_component(thumbnail15.$$.fragment);
    			t68 = space();
    			div34 = element("div");
    			t69 = text("Inventions That");
    			img16 = element("img");
    			br7 = element("br");
    			t70 = text("Changed History");
    			t71 = space();
    			div37 = element("div");
    			create_component(thumbnail16.$$.fragment);
    			t72 = space();
    			div36 = element("div");
    			t73 = text("Kevin Hart's Muscle");
    			img17 = element("img");
    			br8 = element("br");
    			t74 = text("Car Crew");
    			t75 = space();
    			div39 = element("div");
    			create_component(thumbnail17.$$.fragment);
    			t76 = space();
    			div38 = element("div");
    			t77 = text("Calls From The");
    			img18 = element("img");
    			br9 = element("br");
    			t78 = text("Inside");
    			t79 = space();
    			div41 = element("div");
    			create_component(thumbnail18.$$.fragment);
    			t80 = space();
    			div40 = element("div");
    			t81 = text("Building The");
    			img19 = element("img");
    			br10 = element("br");
    			t82 = text("Legend");
    			t83 = space();
    			div43 = element("div");
    			create_component(thumbnail19.$$.fragment);
    			t84 = space();
    			div42 = element("div");
    			t85 = text("Love in the");
    			img20 = element("img");
    			br11 = element("br");
    			t86 = text("Jungle");
    			t87 = space();
    			div45 = element("div");
    			t12_1 = element("t1");
    			t12_1.textContent = "Utmanande Äventyr";
    			t89 = space();
    			div66 = element("div");
    			div47 = element("div");
    			create_component(thumbnail20.$$.fragment);
    			t90 = space();
    			div46 = element("div");
    			t91 = text("The Island Sverige");
    			img21 = element("img");
    			t92 = space();
    			div49 = element("div");
    			create_component(thumbnail21.$$.fragment);
    			t93 = space();
    			div48 = element("div");
    			t94 = text("Ensam i vildmarken");
    			img22 = element("img");
    			t95 = space();
    			div51 = element("div");
    			create_component(thumbnail22.$$.fragment);
    			t96 = space();
    			div50 = element("div");
    			t97 = text("Över Atlanten");
    			img23 = element("img");
    			t98 = space();
    			div53 = element("div");
    			create_component(thumbnail23.$$.fragment);
    			t99 = space();
    			div52 = element("div");
    			t100 = text("Deadliest Catch");
    			img24 = element("img");
    			t101 = space();
    			div55 = element("div");
    			create_component(thumbnail24.$$.fragment);
    			t102 = space();
    			div54 = element("div");
    			t103 = text("Ed Stafford: Left for");
    			img25 = element("img");
    			br12 = element("br");
    			t104 = text("Dead");
    			t105 = space();
    			div57 = element("div");
    			create_component(thumbnail25.$$.fragment);
    			t106 = space();
    			div56 = element("div");
    			t107 = text("Everest: Beyond the");
    			img26 = element("img");
    			br13 = element("br");
    			t108 = text("Limit");
    			t109 = space();
    			div59 = element("div");
    			create_component(thumbnail26.$$.fragment);
    			t110 = space();
    			div58 = element("div");
    			t111 = text("The Impossible Row");
    			img27 = element("img");
    			t112 = space();
    			div61 = element("div");
    			create_component(thumbnail27.$$.fragment);
    			t113 = space();
    			div60 = element("div");
    			t114 = text("Survive That!");
    			img28 = element("img");
    			t115 = space();
    			div63 = element("div");
    			create_component(thumbnail28.$$.fragment);
    			t116 = space();
    			div62 = element("div");
    			t117 = text("100 Days Wild");
    			img29 = element("img");
    			t118 = space();
    			div65 = element("div");
    			create_component(thumbnail29.$$.fragment);
    			t119 = space();
    			div64 = element("div");
    			t120 = text("Pushing the line");
    			img30 = element("img");
    			t121 = space();
    			div69 = element("div");
    			button4 = element("button");
    			img31 = element("img");
    			t122 = space();
    			button5 = element("button");
    			img32 = element("img");
    			t123 = space();
    			button6 = element("button");
    			t124 = text("Next");
    			t125 = space();
    			div67 = element("div");
    			img33 = element("img");
    			t126 = space();
    			img34 = element("img");
    			t127 = space();
    			button7 = element("button");
    			t128 = text("Previous");
    			t129 = space();
    			div68 = element("div");
    			img35 = element("img");
    			t130 = space();
    			img36 = element("img");
    			t131 = space();
    			div70 = element("div");
    			t13_1 = element("t1");
    			t13_1.textContent = "Fastna framför en serie";
    			t133 = space();
    			div91 = element("div");
    			div72 = element("div");
    			create_component(thumbnail30.$$.fragment);
    			t134 = space();
    			div71 = element("div");
    			t135 = text("Vi i villa");
    			img37 = element("img");
    			t136 = space();
    			div74 = element("div");
    			create_component(thumbnail31.$$.fragment);
    			t137 = space();
    			div73 = element("div");
    			t138 = text("Dopamin");
    			img38 = element("img");
    			t139 = space();
    			div76 = element("div");
    			create_component(thumbnail32.$$.fragment);
    			t140 = space();
    			div75 = element("div");
    			t141 = text("Mörkt hjärta");
    			img39 = element("img");
    			t142 = space();
    			div78 = element("div");
    			create_component(thumbnail33.$$.fragment);
    			t143 = space();
    			div77 = element("div");
    			t144 = text("Sommaren med");
    			img40 = element("img");
    			br14 = element("br");
    			t145 = text("släkten");
    			t146 = space();
    			div80 = element("div");
    			create_component(thumbnail34.$$.fragment);
    			t147 = space();
    			div79 = element("div");
    			t148 = text("LIGGA - konsten att");
    			img41 = element("img");
    			br15 = element("br");
    			t149 = text("komma över sitt ex");
    			t150 = space();
    			div82 = element("div");
    			create_component(thumbnail35.$$.fragment);
    			t151 = space();
    			div81 = element("div");
    			t152 = text("Pappas pojkar");
    			img42 = element("img");
    			br16 = element("br");
    			t153 = text("Limit");
    			t154 = space();
    			div84 = element("div");
    			create_component(thumbnail36.$$.fragment);
    			t155 = space();
    			div83 = element("div");
    			t156 = text("Udda veckor");
    			img43 = element("img");
    			t157 = space();
    			div86 = element("div");
    			create_component(thumbnail37.$$.fragment);
    			t158 = space();
    			div85 = element("div");
    			t159 = text("Alla mot alla med ");
    			img44 = element("img");
    			br17 = element("br");
    			t160 = text("Filip och Fredrik");
    			t161 = space();
    			div88 = element("div");
    			create_component(thumbnail38.$$.fragment);
    			t162 = space();
    			div87 = element("div");
    			t163 = text("The Island Sverige");
    			img45 = element("img");
    			t164 = space();
    			div90 = element("div");
    			create_component(thumbnail39.$$.fragment);
    			t165 = space();
    			div89 = element("div");
    			t166 = text("Sommaren med");
    			img46 = element("img");
    			br18 = element("br");
    			t167 = text("släkten");
    			t168 = space();
    			div92 = element("div");
    			t14_1 = element("t1");
    			t14_1.textContent = "Dokumentärer";
    			t170 = space();
    			div113 = element("div");
    			div94 = element("div");
    			create_component(thumbnail40.$$.fragment);
    			t171 = space();
    			div93 = element("div");
    			t172 = text("Rönnäsfallet - jakten");
    			img47 = element("img");
    			br19 = element("br");
    			t173 = text("på sanningen");
    			t174 = space();
    			div96 = element("div");
    			create_component(thumbnail41.$$.fragment);
    			t175 = space();
    			div95 = element("div");
    			t176 = text("Ted Bundy: Mind Of");
    			img48 = element("img");
    			br20 = element("br");
    			t177 = text("A Monster");
    			t178 = space();
    			div98 = element("div");
    			create_component(thumbnail42.$$.fragment);
    			t179 = space();
    			div97 = element("div");
    			t180 = text("Insats Torsk -");
    			img49 = element("img");
    			br21 = element("br");
    			t181 = text("Sexhandeln inifrån");
    			t182 = space();
    			div100 = element("div");
    			create_component(thumbnail43.$$.fragment);
    			t183 = space();
    			div99 = element("div");
    			t184 = text("Joakim Lundell -");
    			img50 = element("img");
    			br22 = element("br");
    			t185 = text("Jockiboi räddade...");
    			t186 = space();
    			div102 = element("div");
    			create_component(thumbnail44.$$.fragment);
    			t187 = space();
    			div101 = element("div");
    			t188 = text("Tunnelbanan");
    			img51 = element("img");
    			t189 = space();
    			div104 = element("div");
    			create_component(thumbnail45.$$.fragment);
    			t190 = space();
    			div103 = element("div");
    			t191 = text("Vägens Hjältar");
    			img52 = element("img");
    			t192 = space();
    			div106 = element("div");
    			create_component(thumbnail46.$$.fragment);
    			t193 = space();
    			div105 = element("div");
    			t194 = text("The Murder Tapes");
    			img53 = element("img");
    			t195 = space();
    			div108 = element("div");
    			create_component(thumbnail47.$$.fragment);
    			t196 = space();
    			div107 = element("div");
    			t197 = text("Ed Stafford: Left for");
    			img54 = element("img");
    			br23 = element("br");
    			t198 = text("Dead");
    			t199 = space();
    			div110 = element("div");
    			create_component(thumbnail48.$$.fragment);
    			t200 = space();
    			div109 = element("div");
    			t201 = text("100 Days Wild");
    			img55 = element("img");
    			t202 = space();
    			div112 = element("div");
    			create_component(thumbnail49.$$.fragment);
    			t203 = space();
    			div111 = element("div");
    			t204 = text("Survive That!");
    			img56 = element("img");
    			t205 = space();
    			create_component(overlay.$$.fragment);
    			t206 = space();
    			src = element("src");
    			attr_dev(link, "href", "https://fonts.googleapis.com/css2?family=Poppins:wght@200&display=swap");
    			attr_dev(link, "rel", "stylesheet");
    			attr_dev(link, "class", "svelte-zdav59");
    			add_location(link, file, 0, 0, 0);
    			attr_dev(img0, "class", "logo svelte-zdav59");
    			if (!src_url_equal(img0.src, img0_src_value = "discoverylogo.png")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "logo");
    			attr_dev(img0, "unselectable", "on");
    			attr_dev(img0, "height", "90px");
    			add_location(img0, file, 46, 60, 1116);
    			attr_dev(h1, "id", "title");
    			set_style(h1, "display", /*visibility*/ ctx[1] ? "" : "none");
    			attr_dev(h1, "class", "svelte-zdav59");
    			add_location(h1, file, 46, 1, 1057);
    			attr_dev(div0, "class", "background svelte-zdav59");
    			add_location(div0, file, 47, 1, 1218);
    			attr_dev(button0, "class", "choosecategory svelte-zdav59");
    			add_location(button0, file, 48, 1, 1245);
    			attr_dev(button1, "class", "choosecategory svelte-zdav59");
    			add_location(button1, file, 56, 1, 1425);
    			attr_dev(button2, "class", "choosecategory svelte-zdav59");
    			add_location(button2, file, 64, 1, 1600);
    			attr_dev(button3, "class", "choosecategory svelte-zdav59");
    			add_location(button3, file, 72, 1, 1774);
    			attr_dev(t10_1, "class", "svelte-zdav59");
    			add_location(t10_1, file, 81, 2, 2051);
    			attr_dev(div1, "class", "categories svelte-zdav59");
    			set_style(div1, "display", /*showutvalt*/ ctx[4] ? "" : "none");
    			add_location(div1, file, 80, 1, 1980);
    			attr_dev(img1, "class", "titlelogo svelte-zdav59");
    			if (!src_url_equal(img1.src, img1_src_value = "logo.png")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "logo");
    			attr_dev(img1, "unselectable", "on");
    			attr_dev(img1, "height", "30px");
    			add_location(img1, file, 86, 41, 2272);
    			attr_dev(div2, "class", "templatetext svelte-zdav59");
    			add_location(div2, file, 86, 3, 2234);
    			attr_dev(div3, "class", "template svelte-zdav59");
    			add_location(div3, file, 84, 2, 2162);
    			attr_dev(img2, "class", "titlelogo svelte-zdav59");
    			if (!src_url_equal(img2.src, img2_src_value = "logo.png")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "alt", "logo");
    			attr_dev(img2, "unselectable", "on");
    			attr_dev(img2, "height", "30px");
    			add_location(img2, file, 90, 41, 2481);
    			attr_dev(div4, "class", "templatetext svelte-zdav59");
    			add_location(div4, file, 90, 3, 2443);
    			attr_dev(div5, "class", "template svelte-zdav59");
    			add_location(div5, file, 88, 2, 2371);
    			attr_dev(img3, "class", "titlelogo svelte-zdav59");
    			if (!src_url_equal(img3.src, img3_src_value = "5logo.png")) attr_dev(img3, "src", img3_src_value);
    			attr_dev(img3, "alt", "logo");
    			attr_dev(img3, "unselectable", "on");
    			attr_dev(img3, "height", "30px");
    			add_location(img3, file, 94, 47, 2696);
    			attr_dev(br0, "class", "svelte-zdav59");
    			add_location(br0, file, 94, 129, 2778);
    			attr_dev(div6, "class", "templatetext svelte-zdav59");
    			add_location(div6, file, 94, 3, 2652);
    			attr_dev(div7, "class", "template svelte-zdav59");
    			add_location(div7, file, 92, 2, 2580);
    			attr_dev(img4, "class", "titlelogo svelte-zdav59");
    			if (!src_url_equal(img4.src, img4_src_value = "logo.png")) attr_dev(img4, "src", img4_src_value);
    			attr_dev(img4, "alt", "logo");
    			attr_dev(img4, "unselectable", "on");
    			attr_dev(img4, "height", "30px");
    			add_location(img4, file, 98, 47, 2933);
    			attr_dev(div8, "class", "templatetext svelte-zdav59");
    			add_location(div8, file, 98, 3, 2889);
    			attr_dev(div9, "class", "template svelte-zdav59");
    			add_location(div9, file, 96, 2, 2817);
    			attr_dev(img5, "class", "titlelogo svelte-zdav59");
    			if (!src_url_equal(img5.src, img5_src_value = "logo.png")) attr_dev(img5, "src", img5_src_value);
    			attr_dev(img5, "alt", "logo");
    			attr_dev(img5, "unselectable", "on");
    			attr_dev(img5, "height", "30px");
    			add_location(img5, file, 102, 43, 3154);
    			attr_dev(div10, "class", "templatetext svelte-zdav59");
    			add_location(div10, file, 102, 3, 3114);
    			attr_dev(div11, "class", "template svelte-zdav59");
    			attr_dev(div11, "dir", "ltr");
    			add_location(div11, file, 100, 2, 3032);
    			attr_dev(img6, "class", "titlelogo svelte-zdav59");
    			if (!src_url_equal(img6.src, img6_src_value = "logo.png")) attr_dev(img6, "src", img6_src_value);
    			attr_dev(img6, "alt", "logo");
    			attr_dev(img6, "unselectable", "on");
    			attr_dev(img6, "height", "30px");
    			add_location(img6, file, 106, 41, 3373);
    			attr_dev(br1, "class", "svelte-zdav59");
    			add_location(br1, file, 106, 122, 3454);
    			attr_dev(div12, "class", "templatetext svelte-zdav59");
    			add_location(div12, file, 106, 3, 3335);
    			attr_dev(div13, "class", "template svelte-zdav59");
    			attr_dev(div13, "dir", "ltr");
    			add_location(div13, file, 104, 2, 3253);
    			attr_dev(img7, "class", "titlelogo svelte-zdav59");
    			if (!src_url_equal(img7.src, img7_src_value = "dlogo.png")) attr_dev(img7, "src", img7_src_value);
    			attr_dev(img7, "alt", "logo");
    			attr_dev(img7, "unselectable", "on");
    			attr_dev(img7, "height", "30px");
    			add_location(img7, file, 110, 45, 3607);
    			attr_dev(br2, "class", "svelte-zdav59");
    			add_location(br2, file, 110, 127, 3689);
    			attr_dev(div14, "class", "templatetext svelte-zdav59");
    			add_location(div14, file, 110, 3, 3565);
    			attr_dev(div15, "class", "template svelte-zdav59");
    			attr_dev(div15, "dir", "ltr");
    			add_location(div15, file, 108, 2, 3483);
    			attr_dev(img8, "class", "titlelogo svelte-zdav59");
    			if (!src_url_equal(img8.src, img8_src_value = "logo.png")) attr_dev(img8, "src", img8_src_value);
    			attr_dev(img8, "alt", "logo");
    			attr_dev(img8, "unselectable", "on");
    			attr_dev(img8, "height", "30px");
    			add_location(img8, file, 114, 43, 3838);
    			attr_dev(br3, "class", "svelte-zdav59");
    			add_location(br3, file, 114, 124, 3919);
    			attr_dev(div16, "class", "templatetext svelte-zdav59");
    			add_location(div16, file, 114, 3, 3798);
    			attr_dev(div17, "class", "template svelte-zdav59");
    			attr_dev(div17, "dir", "ltr");
    			add_location(div17, file, 112, 2, 3715);
    			attr_dev(img9, "class", "titlelogo svelte-zdav59");
    			if (!src_url_equal(img9.src, img9_src_value = "logo.png")) attr_dev(img9, "src", img9_src_value);
    			attr_dev(img9, "alt", "logo");
    			attr_dev(img9, "unselectable", "on");
    			attr_dev(img9, "height", "30px");
    			add_location(img9, file, 118, 37, 4064);
    			attr_dev(div18, "class", "templatetext svelte-zdav59");
    			add_location(div18, file, 118, 3, 4030);
    			attr_dev(div19, "class", "template svelte-zdav59");
    			attr_dev(div19, "dir", "ltr");
    			add_location(div19, file, 116, 2, 3947);
    			attr_dev(img10, "class", "titlelogo svelte-zdav59");
    			if (!src_url_equal(img10.src, img10_src_value = "5logo.png")) attr_dev(img10, "src", img10_src_value);
    			attr_dev(img10, "alt", "logo");
    			attr_dev(img10, "unselectable", "on");
    			attr_dev(img10, "height", "30px");
    			add_location(img10, file, 122, 36, 4269);
    			attr_dev(div20, "class", "templatetext svelte-zdav59");
    			add_location(div20, file, 122, 3, 4236);
    			attr_dev(div21, "class", "template svelte-zdav59");
    			add_location(div21, file, 120, 2, 4163);
    			attr_dev(div22, "class", "grid svelte-zdav59");
    			set_style(div22, "display", /*showutvalt*/ ctx[4] ? "" : "none");
    			add_location(div22, file, 83, 1, 2076);
    			attr_dev(t11_1, "class", "svelte-zdav59");
    			add_location(t11_1, file, 126, 2, 4448);
    			attr_dev(div23, "class", "categories svelte-zdav59");
    			set_style(div23, "display", /*shownyheter*/ ctx[5] ? "" : "none");
    			add_location(div23, file, 125, 1, 4376);
    			attr_dev(img11, "class", "titlelogo svelte-zdav59");
    			if (!src_url_equal(img11.src, img11_src_value = "logo.png")) attr_dev(img11, "src", img11_src_value);
    			attr_dev(img11, "alt", "logo");
    			attr_dev(img11, "unselectable", "on");
    			attr_dev(img11, "height", "30px");
    			add_location(img11, file, 131, 39, 4680);
    			attr_dev(br4, "class", "svelte-zdav59");
    			add_location(br4, file, 131, 120, 4761);
    			attr_dev(div24, "class", "templatetext svelte-zdav59");
    			add_location(div24, file, 131, 3, 4644);
    			attr_dev(div25, "class", "template svelte-zdav59");
    			add_location(div25, file, 129, 2, 4572);
    			attr_dev(img12, "class", "titlelogo svelte-zdav59");
    			if (!src_url_equal(img12.src, img12_src_value = "logo.png")) attr_dev(img12, "src", img12_src_value);
    			attr_dev(img12, "alt", "logo");
    			attr_dev(img12, "unselectable", "on");
    			attr_dev(img12, "height", "30px");
    			add_location(img12, file, 135, 50, 4907);
    			attr_dev(br5, "class", "svelte-zdav59");
    			add_location(br5, file, 135, 131, 4988);
    			attr_dev(div26, "class", "templatetext svelte-zdav59");
    			add_location(div26, file, 135, 3, 4860);
    			attr_dev(div27, "class", "template svelte-zdav59");
    			add_location(div27, file, 133, 2, 4788);
    			attr_dev(img13, "class", "titlelogo svelte-zdav59");
    			if (!src_url_equal(img13.src, img13_src_value = "idlogo.png")) attr_dev(img13, "src", img13_src_value);
    			attr_dev(img13, "alt", "logo");
    			attr_dev(img13, "unselectable", "on");
    			attr_dev(img13, "height", "30px");
    			add_location(img13, file, 139, 45, 5136);
    			attr_dev(div28, "class", "templatetext svelte-zdav59");
    			add_location(div28, file, 139, 3, 5094);
    			attr_dev(div29, "class", "template svelte-zdav59");
    			add_location(div29, file, 137, 2, 5022);
    			attr_dev(img14, "class", "titlelogo svelte-zdav59");
    			if (!src_url_equal(img14.src, img14_src_value = "logo.png")) attr_dev(img14, "src", img14_src_value);
    			attr_dev(img14, "alt", "logo");
    			attr_dev(img14, "unselectable", "on");
    			attr_dev(img14, "height", "30px");
    			add_location(img14, file, 143, 41, 5348);
    			attr_dev(div30, "class", "templatetext svelte-zdav59");
    			add_location(div30, file, 143, 3, 5310);
    			attr_dev(div31, "class", "template svelte-zdav59");
    			add_location(div31, file, 141, 2, 5237);
    			attr_dev(img15, "class", "titlelogo svelte-zdav59");
    			if (!src_url_equal(img15.src, img15_src_value = "logo.png")) attr_dev(img15, "src", img15_src_value);
    			attr_dev(img15, "alt", "logo");
    			attr_dev(img15, "unselectable", "on");
    			attr_dev(img15, "height", "30px");
    			add_location(img15, file, 147, 46, 5563);
    			attr_dev(br6, "class", "svelte-zdav59");
    			add_location(br6, file, 147, 127, 5644);
    			attr_dev(div32, "class", "templatetext svelte-zdav59");
    			add_location(div32, file, 147, 3, 5520);
    			attr_dev(div33, "class", "template svelte-zdav59");
    			add_location(div33, file, 145, 2, 5447);
    			attr_dev(img16, "class", "titlelogo svelte-zdav59");
    			if (!src_url_equal(img16.src, img16_src_value = "logo.png")) attr_dev(img16, "src", img16_src_value);
    			attr_dev(img16, "alt", "logo");
    			attr_dev(img16, "unselectable", "on");
    			attr_dev(img16, "height", "30px");
    			add_location(img16, file, 151, 44, 5785);
    			attr_dev(br7, "class", "svelte-zdav59");
    			add_location(br7, file, 151, 125, 5866);
    			attr_dev(div34, "class", "templatetext svelte-zdav59");
    			add_location(div34, file, 151, 3, 5744);
    			attr_dev(div35, "class", "template svelte-zdav59");
    			add_location(div35, file, 149, 2, 5671);
    			attr_dev(img17, "class", "titlelogo svelte-zdav59");
    			if (!src_url_equal(img17.src, img17_src_value = "dlogo.png")) attr_dev(img17, "src", img17_src_value);
    			attr_dev(img17, "alt", "logo");
    			attr_dev(img17, "unselectable", "on");
    			attr_dev(img17, "height", "30px");
    			add_location(img17, file, 155, 48, 6021);
    			attr_dev(br8, "class", "svelte-zdav59");
    			add_location(br8, file, 155, 130, 6103);
    			attr_dev(div36, "class", "templatetext svelte-zdav59");
    			add_location(div36, file, 155, 3, 5976);
    			attr_dev(div37, "class", "template svelte-zdav59");
    			add_location(div37, file, 153, 2, 5903);
    			attr_dev(img18, "class", "titlelogo svelte-zdav59");
    			if (!src_url_equal(img18.src, img18_src_value = "idlogo.png")) attr_dev(img18, "src", img18_src_value);
    			attr_dev(img18, "alt", "logo");
    			attr_dev(img18, "unselectable", "on");
    			attr_dev(img18, "height", "30px");
    			add_location(img18, file, 159, 43, 6246);
    			attr_dev(br9, "class", "svelte-zdav59");
    			add_location(br9, file, 159, 126, 6329);
    			attr_dev(div38, "class", "templatetext svelte-zdav59");
    			add_location(div38, file, 159, 3, 6206);
    			attr_dev(div39, "class", "template svelte-zdav59");
    			add_location(div39, file, 157, 2, 6133);
    			attr_dev(img19, "class", "titlelogo svelte-zdav59");
    			if (!src_url_equal(img19.src, img19_src_value = "logo.png")) attr_dev(img19, "src", img19_src_value);
    			attr_dev(img19, "alt", "logo");
    			attr_dev(img19, "unselectable", "on");
    			attr_dev(img19, "height", "30px");
    			add_location(img19, file, 163, 41, 6468);
    			attr_dev(br10, "class", "svelte-zdav59");
    			add_location(br10, file, 163, 122, 6549);
    			attr_dev(div40, "class", "templatetext svelte-zdav59");
    			add_location(div40, file, 163, 3, 6430);
    			attr_dev(div41, "class", "template svelte-zdav59");
    			add_location(div41, file, 161, 2, 6357);
    			attr_dev(img20, "class", "titlelogo svelte-zdav59");
    			if (!src_url_equal(img20.src, img20_src_value = "logo.png")) attr_dev(img20, "src", img20_src_value);
    			attr_dev(img20, "alt", "logo");
    			attr_dev(img20, "unselectable", "on");
    			attr_dev(img20, "height", "30px");
    			add_location(img20, file, 167, 40, 6687);
    			attr_dev(br11, "class", "svelte-zdav59");
    			add_location(br11, file, 167, 121, 6768);
    			attr_dev(div42, "class", "templatetext svelte-zdav59");
    			add_location(div42, file, 167, 3, 6650);
    			attr_dev(div43, "class", "template svelte-zdav59");
    			add_location(div43, file, 165, 2, 6577);
    			attr_dev(div44, "class", "grid svelte-zdav59");
    			set_style(div44, "display", /*shownyheter*/ ctx[5] ? "" : "none");
    			add_location(div44, file, 128, 1, 4485);
    			attr_dev(t12_1, "class", "svelte-zdav59");
    			add_location(t12_1, file, 171, 2, 6875);
    			attr_dev(div45, "class", "categories svelte-zdav59");
    			set_style(div45, "display", /*showäventyr*/ ctx[6] ? "" : "none");
    			add_location(div45, file, 170, 1, 6803);
    			attr_dev(img21, "class", "titlelogo svelte-zdav59");
    			if (!src_url_equal(img21.src, img21_src_value = "logo.png")) attr_dev(img21, "src", img21_src_value);
    			attr_dev(img21, "alt", "logo");
    			attr_dev(img21, "unselectable", "on");
    			attr_dev(img21, "height", "30px");
    			add_location(img21, file, 176, 47, 7114);
    			attr_dev(div46, "class", "templatetext svelte-zdav59");
    			add_location(div46, file, 176, 3, 7070);
    			attr_dev(div47, "class", "template svelte-zdav59");
    			add_location(div47, file, 174, 2, 6998);
    			attr_dev(img22, "class", "titlelogo svelte-zdav59");
    			if (!src_url_equal(img22.src, img22_src_value = "logo.png")) attr_dev(img22, "src", img22_src_value);
    			attr_dev(img22, "alt", "logo");
    			attr_dev(img22, "unselectable", "on");
    			attr_dev(img22, "height", "30px");
    			add_location(img22, file, 180, 47, 7330);
    			attr_dev(div48, "class", "templatetext svelte-zdav59");
    			add_location(div48, file, 180, 3, 7286);
    			attr_dev(div49, "class", "template svelte-zdav59");
    			add_location(div49, file, 178, 2, 7213);
    			attr_dev(img23, "class", "titlelogo svelte-zdav59");
    			if (!src_url_equal(img23.src, img23_src_value = "5logo.png")) attr_dev(img23, "src", img23_src_value);
    			attr_dev(img23, "alt", "logo");
    			attr_dev(img23, "unselectable", "on");
    			attr_dev(img23, "height", "30px");
    			add_location(img23, file, 184, 42, 7541);
    			attr_dev(div50, "class", "templatetext svelte-zdav59");
    			add_location(div50, file, 184, 3, 7502);
    			attr_dev(div51, "class", "template svelte-zdav59");
    			add_location(div51, file, 182, 2, 7429);
    			attr_dev(img24, "class", "titlelogo svelte-zdav59");
    			if (!src_url_equal(img24.src, img24_src_value = "dlogo.png")) attr_dev(img24, "src", img24_src_value);
    			attr_dev(img24, "alt", "logo");
    			attr_dev(img24, "unselectable", "on");
    			attr_dev(img24, "height", "30px");
    			add_location(img24, file, 188, 44, 7755);
    			attr_dev(div52, "class", "templatetext svelte-zdav59");
    			add_location(div52, file, 188, 3, 7714);
    			attr_dev(div53, "class", "template svelte-zdav59");
    			add_location(div53, file, 186, 2, 7641);
    			attr_dev(img25, "class", "titlelogo svelte-zdav59");
    			if (!src_url_equal(img25.src, img25_src_value = "dlogo.png")) attr_dev(img25, "src", img25_src_value);
    			attr_dev(img25, "alt", "logo");
    			attr_dev(img25, "unselectable", "on");
    			attr_dev(img25, "height", "30px");
    			add_location(img25, file, 192, 50, 7975);
    			attr_dev(br12, "class", "svelte-zdav59");
    			add_location(br12, file, 192, 132, 8057);
    			attr_dev(div54, "class", "templatetext svelte-zdav59");
    			add_location(div54, file, 192, 3, 7928);
    			attr_dev(div55, "class", "template svelte-zdav59");
    			add_location(div55, file, 190, 2, 7855);
    			attr_dev(img26, "class", "titlelogo svelte-zdav59");
    			if (!src_url_equal(img26.src, img26_src_value = "elogo.png")) attr_dev(img26, "src", img26_src_value);
    			attr_dev(img26, "alt", "logo");
    			attr_dev(img26, "unselectable", "on");
    			attr_dev(img26, "height", "30px");
    			add_location(img26, file, 196, 48, 8201);
    			attr_dev(br13, "class", "svelte-zdav59");
    			add_location(br13, file, 196, 130, 8283);
    			attr_dev(div56, "class", "templatetext svelte-zdav59");
    			add_location(div56, file, 196, 3, 8156);
    			attr_dev(div57, "class", "template svelte-zdav59");
    			add_location(div57, file, 194, 2, 8083);
    			attr_dev(img27, "class", "titlelogo svelte-zdav59");
    			if (!src_url_equal(img27.src, img27_src_value = "logo.png")) attr_dev(img27, "src", img27_src_value);
    			attr_dev(img27, "alt", "logo");
    			attr_dev(img27, "unselectable", "on");
    			attr_dev(img27, "height", "30px");
    			add_location(img27, file, 200, 47, 8427);
    			attr_dev(div58, "class", "templatetext svelte-zdav59");
    			add_location(div58, file, 200, 3, 8383);
    			attr_dev(div59, "class", "template svelte-zdav59");
    			add_location(div59, file, 198, 2, 8310);
    			attr_dev(img28, "class", "titlelogo svelte-zdav59");
    			if (!src_url_equal(img28.src, img28_src_value = "dlogo.png")) attr_dev(img28, "src", img28_src_value);
    			attr_dev(img28, "alt", "logo");
    			attr_dev(img28, "unselectable", "on");
    			attr_dev(img28, "height", "30px");
    			add_location(img28, file, 204, 42, 8638);
    			attr_dev(div60, "class", "templatetext svelte-zdav59");
    			add_location(div60, file, 204, 3, 8599);
    			attr_dev(div61, "class", "template svelte-zdav59");
    			add_location(div61, file, 202, 2, 8526);
    			attr_dev(img29, "class", "titlelogo svelte-zdav59");
    			if (!src_url_equal(img29.src, img29_src_value = "dlogo.png")) attr_dev(img29, "src", img29_src_value);
    			attr_dev(img29, "alt", "logo");
    			attr_dev(img29, "unselectable", "on");
    			attr_dev(img29, "height", "30px");
    			add_location(img29, file, 208, 42, 8850);
    			attr_dev(div62, "class", "templatetext svelte-zdav59");
    			add_location(div62, file, 208, 3, 8811);
    			attr_dev(div63, "class", "template svelte-zdav59");
    			add_location(div63, file, 206, 2, 8738);
    			attr_dev(img30, "class", "titlelogo svelte-zdav59");
    			if (!src_url_equal(img30.src, img30_src_value = "logo.png")) attr_dev(img30, "src", img30_src_value);
    			attr_dev(img30, "alt", "logo");
    			attr_dev(img30, "unselectable", "on");
    			attr_dev(img30, "height", "30px");
    			add_location(img30, file, 212, 45, 9065);
    			attr_dev(div64, "class", "templatetext svelte-zdav59");
    			add_location(div64, file, 212, 3, 9023);
    			attr_dev(div65, "class", "template svelte-zdav59");
    			add_location(div65, file, 210, 2, 8950);
    			attr_dev(div66, "class", "grid svelte-zdav59");
    			set_style(div66, "display", /*showäventyr*/ ctx[6] ? "" : "none");
    			add_location(div66, file, 173, 1, 6911);
    			attr_dev(img31, "class", "banner svelte-zdav59");
    			if (!src_url_equal(img31.src, img31_src_value = "allamotalla.png")) attr_dev(img31, "src", img31_src_value);
    			attr_dev(img31, "alt", "logo");
    			attr_dev(img31, "unselectable", "on");
    			add_location(img31, file, 220, 7, 9413);
    			attr_dev(button4, "class", "button svelte-zdav59");
    			set_style(button4, "display", /*show*/ ctx[2] ? "none" : "");
    			add_location(button4, file, 216, 2, 9238);
    			attr_dev(img32, "class", "banner svelte-zdav59");
    			if (!src_url_equal(img32.src, img32_src_value = "johnnyvsamber.png")) attr_dev(img32, "src", img32_src_value);
    			attr_dev(img32, "alt", "logo");
    			attr_dev(img32, "unselectable", "on");
    			add_location(img32, file, 225, 7, 9671);
    			attr_dev(button5, "class", "button2 svelte-zdav59");
    			set_style(button5, "display", /*show*/ ctx[2] ? "" : "none");
    			add_location(button5, file, 221, 2, 9496);
    			attr_dev(button6, "class", "next svelte-zdav59");
    			set_style(button6, "display", /*show*/ ctx[2] ? "none" : "");
    			add_location(button6, file, 226, 2, 9756);
    			attr_dev(img33, "class", "dot svelte-zdav59");
    			if (!src_url_equal(img33.src, img33_src_value = "dotselected.png")) attr_dev(img33, "src", img33_src_value);
    			attr_dev(img33, "alt", "logo");
    			attr_dev(img33, "unselectable", "on");
    			attr_dev(img33, "height", "20px");
    			set_style(img33, "display", /*show*/ ctx[2] ? "none" : "");
    			add_location(img33, file, 228, 3, 9914);
    			attr_dev(img34, "class", "dot svelte-zdav59");
    			if (!src_url_equal(img34.src, img34_src_value = "dot.png")) attr_dev(img34, "src", img34_src_value);
    			attr_dev(img34, "alt", "logo");
    			attr_dev(img34, "unselectable", "on");
    			attr_dev(img34, "height", "20px");
    			set_style(img34, "display", /*show*/ ctx[2] ? "none" : "");
    			add_location(img34, file, 229, 3, 10038);
    			attr_dev(div67, "class", "first svelte-zdav59");
    			set_style(div67, "display", /*show*/ ctx[2] ? "none" : "");
    			add_location(div67, file, 227, 2, 9853);
    			attr_dev(button7, "class", "previous svelte-zdav59");
    			set_style(button7, "display", /*show*/ ctx[2] ? "" : "none");
    			add_location(button7, file, 231, 2, 10162);
    			attr_dev(img35, "class", "dot svelte-zdav59");
    			if (!src_url_equal(img35.src, img35_src_value = "dot.png")) attr_dev(img35, "src", img35_src_value);
    			attr_dev(img35, "alt", "logo");
    			attr_dev(img35, "unselectable", "on");
    			attr_dev(img35, "height", "20px");
    			set_style(img35, "display", /*show*/ ctx[2] ? "" : "none");
    			add_location(img35, file, 233, 3, 10329);
    			attr_dev(img36, "class", "dot svelte-zdav59");
    			if (!src_url_equal(img36.src, img36_src_value = "dotselected.png")) attr_dev(img36, "src", img36_src_value);
    			attr_dev(img36, "alt", "logo");
    			attr_dev(img36, "unselectable", "on");
    			attr_dev(img36, "height", "20px");
    			set_style(img36, "display", /*show*/ ctx[2] ? "" : "none");
    			add_location(img36, file, 234, 3, 10445);
    			attr_dev(div68, "class", "second svelte-zdav59");
    			set_style(div68, "display", /*show*/ ctx[2] ? "" : "none");
    			add_location(div68, file, 232, 2, 10267);
    			attr_dev(div69, "class", "banner svelte-zdav59");
    			set_style(div69, "display", /*showbanner*/ ctx[3] ? "" : "none");
    			add_location(div69, file, 215, 1, 9171);
    			attr_dev(t13_1, "class", "svelte-zdav59");
    			add_location(t13_1, file, 238, 2, 10655);
    			attr_dev(div70, "class", "categories svelte-zdav59");
    			set_style(div70, "display", /*showserier*/ ctx[7] ? "" : "none");
    			add_location(div70, file, 237, 1, 10584);
    			attr_dev(img37, "class", "titlelogo svelte-zdav59");
    			if (!src_url_equal(img37.src, img37_src_value = "logo.png")) attr_dev(img37, "src", img37_src_value);
    			attr_dev(img37, "alt", "logo");
    			attr_dev(img37, "unselectable", "on");
    			attr_dev(img37, "height", "30px");
    			add_location(img37, file, 243, 39, 10892);
    			attr_dev(div71, "class", "templatetext svelte-zdav59");
    			add_location(div71, file, 243, 3, 10856);
    			attr_dev(div72, "class", "template svelte-zdav59");
    			add_location(div72, file, 241, 2, 10783);
    			attr_dev(img38, "class", "titlelogo svelte-zdav59");
    			if (!src_url_equal(img38.src, img38_src_value = "logo.png")) attr_dev(img38, "src", img38_src_value);
    			attr_dev(img38, "alt", "logo");
    			attr_dev(img38, "unselectable", "on");
    			attr_dev(img38, "height", "30px");
    			add_location(img38, file, 247, 36, 11097);
    			attr_dev(div73, "class", "templatetext svelte-zdav59");
    			add_location(div73, file, 247, 3, 11064);
    			attr_dev(div74, "class", "template svelte-zdav59");
    			add_location(div74, file, 245, 2, 10991);
    			attr_dev(img39, "class", "titlelogo svelte-zdav59");
    			if (!src_url_equal(img39.src, img39_src_value = "logo.png")) attr_dev(img39, "src", img39_src_value);
    			attr_dev(img39, "alt", "logo");
    			attr_dev(img39, "unselectable", "on");
    			attr_dev(img39, "height", "30px");
    			add_location(img39, file, 251, 41, 11306);
    			attr_dev(div75, "class", "templatetext svelte-zdav59");
    			add_location(div75, file, 251, 3, 11268);
    			attr_dev(div76, "class", "template svelte-zdav59");
    			add_location(div76, file, 249, 2, 11196);
    			attr_dev(img40, "class", "titlelogo svelte-zdav59");
    			if (!src_url_equal(img40.src, img40_src_value = "logo.png")) attr_dev(img40, "src", img40_src_value);
    			attr_dev(img40, "alt", "logo");
    			attr_dev(img40, "unselectable", "on");
    			attr_dev(img40, "height", "30px");
    			add_location(img40, file, 255, 41, 11515);
    			attr_dev(br14, "class", "svelte-zdav59");
    			add_location(br14, file, 255, 122, 11596);
    			attr_dev(div77, "class", "templatetext svelte-zdav59");
    			add_location(div77, file, 255, 3, 11477);
    			attr_dev(div78, "class", "template svelte-zdav59");
    			add_location(div78, file, 253, 2, 11405);
    			attr_dev(img41, "class", "titlelogo svelte-zdav59");
    			if (!src_url_equal(img41.src, img41_src_value = "logo.png")) attr_dev(img41, "src", img41_src_value);
    			attr_dev(img41, "alt", "logo");
    			attr_dev(img41, "unselectable", "on");
    			attr_dev(img41, "height", "30px");
    			add_location(img41, file, 259, 48, 11743);
    			attr_dev(br15, "class", "svelte-zdav59");
    			add_location(br15, file, 259, 129, 11824);
    			attr_dev(div79, "class", "templatetext svelte-zdav59");
    			add_location(div79, file, 259, 3, 11698);
    			attr_dev(div80, "class", "template svelte-zdav59");
    			add_location(div80, file, 257, 2, 11625);
    			attr_dev(img42, "class", "titlelogo svelte-zdav59");
    			if (!src_url_equal(img42.src, img42_src_value = "logo.png")) attr_dev(img42, "src", img42_src_value);
    			attr_dev(img42, "alt", "logo");
    			attr_dev(img42, "unselectable", "on");
    			attr_dev(img42, "height", "30px");
    			add_location(img42, file, 263, 42, 11976);
    			attr_dev(br16, "class", "svelte-zdav59");
    			add_location(br16, file, 263, 123, 12057);
    			attr_dev(div81, "class", "templatetext svelte-zdav59");
    			add_location(div81, file, 263, 3, 11937);
    			attr_dev(div82, "class", "template svelte-zdav59");
    			add_location(div82, file, 261, 2, 11864);
    			attr_dev(img43, "class", "titlelogo svelte-zdav59");
    			if (!src_url_equal(img43.src, img43_src_value = "logo.png")) attr_dev(img43, "src", img43_src_value);
    			attr_dev(img43, "alt", "logo");
    			attr_dev(img43, "unselectable", "on");
    			attr_dev(img43, "height", "30px");
    			add_location(img43, file, 267, 40, 12194);
    			attr_dev(div83, "class", "templatetext svelte-zdav59");
    			add_location(div83, file, 267, 3, 12157);
    			attr_dev(div84, "class", "template svelte-zdav59");
    			add_location(div84, file, 265, 2, 12084);
    			attr_dev(img44, "class", "titlelogo svelte-zdav59");
    			if (!src_url_equal(img44.src, img44_src_value = "5logo.png")) attr_dev(img44, "src", img44_src_value);
    			attr_dev(img44, "alt", "logo");
    			attr_dev(img44, "unselectable", "on");
    			attr_dev(img44, "height", "30px");
    			add_location(img44, file, 271, 47, 12409);
    			attr_dev(br17, "class", "svelte-zdav59");
    			add_location(br17, file, 271, 129, 12491);
    			attr_dev(div85, "class", "templatetext svelte-zdav59");
    			add_location(div85, file, 271, 3, 12365);
    			attr_dev(div86, "class", "template svelte-zdav59");
    			add_location(div86, file, 269, 2, 12293);
    			attr_dev(img45, "class", "titlelogo svelte-zdav59");
    			if (!src_url_equal(img45.src, img45_src_value = "logo.png")) attr_dev(img45, "src", img45_src_value);
    			attr_dev(img45, "alt", "logo");
    			attr_dev(img45, "unselectable", "on");
    			attr_dev(img45, "height", "30px");
    			add_location(img45, file, 275, 47, 12646);
    			attr_dev(div87, "class", "templatetext svelte-zdav59");
    			add_location(div87, file, 275, 3, 12602);
    			attr_dev(div88, "class", "template svelte-zdav59");
    			add_location(div88, file, 273, 2, 12530);
    			attr_dev(img46, "class", "titlelogo svelte-zdav59");
    			if (!src_url_equal(img46.src, img46_src_value = "logo.png")) attr_dev(img46, "src", img46_src_value);
    			attr_dev(img46, "alt", "logo");
    			attr_dev(img46, "unselectable", "on");
    			attr_dev(img46, "height", "30px");
    			add_location(img46, file, 279, 41, 12865);
    			attr_dev(br18, "class", "svelte-zdav59");
    			add_location(br18, file, 279, 122, 12946);
    			attr_dev(div89, "class", "templatetext svelte-zdav59");
    			add_location(div89, file, 279, 3, 12827);
    			attr_dev(div90, "class", "template svelte-zdav59");
    			attr_dev(div90, "dir", "ltr");
    			add_location(div90, file, 277, 2, 12745);
    			attr_dev(div91, "class", "grid svelte-zdav59");
    			set_style(div91, "display", /*showserier*/ ctx[7] ? "" : "none");
    			add_location(div91, file, 240, 1, 10697);
    			attr_dev(t14_1, "class", "svelte-zdav59");
    			add_location(t14_1, file, 283, 2, 13059);
    			attr_dev(div92, "class", "categories svelte-zdav59");
    			set_style(div92, "display", /*showdokumentärer*/ ctx[8] ? "" : "none");
    			add_location(div92, file, 282, 1, 12982);
    			attr_dev(img47, "class", "titlelogo svelte-zdav59");
    			if (!src_url_equal(img47.src, img47_src_value = "logo.png")) attr_dev(img47, "src", img47_src_value);
    			attr_dev(img47, "alt", "logo");
    			attr_dev(img47, "unselectable", "on");
    			attr_dev(img47, "height", "30px");
    			add_location(img47, file, 288, 50, 13302);
    			attr_dev(br19, "class", "svelte-zdav59");
    			add_location(br19, file, 288, 131, 13383);
    			attr_dev(div93, "class", "templatetext svelte-zdav59");
    			add_location(div93, file, 288, 3, 13255);
    			attr_dev(div94, "class", "template svelte-zdav59");
    			add_location(div94, file, 286, 2, 13182);
    			attr_dev(img48, "class", "titlelogo svelte-zdav59");
    			if (!src_url_equal(img48.src, img48_src_value = "idlogo.png")) attr_dev(img48, "src", img48_src_value);
    			attr_dev(img48, "alt", "logo");
    			attr_dev(img48, "unselectable", "on");
    			attr_dev(img48, "height", "30px");
    			add_location(img48, file, 292, 47, 13534);
    			attr_dev(br20, "class", "svelte-zdav59");
    			add_location(br20, file, 292, 130, 13617);
    			attr_dev(div95, "class", "templatetext svelte-zdav59");
    			add_location(div95, file, 292, 3, 13490);
    			attr_dev(div96, "class", "template svelte-zdav59");
    			add_location(div96, file, 290, 2, 13417);
    			attr_dev(img49, "class", "titlelogo svelte-zdav59");
    			if (!src_url_equal(img49.src, img49_src_value = "logo.png")) attr_dev(img49, "src", img49_src_value);
    			attr_dev(img49, "alt", "logo");
    			attr_dev(img49, "unselectable", "on");
    			attr_dev(img49, "height", "30px");
    			add_location(img49, file, 296, 43, 13761);
    			attr_dev(br21, "class", "svelte-zdav59");
    			add_location(br21, file, 296, 124, 13842);
    			attr_dev(div97, "class", "templatetext svelte-zdav59");
    			add_location(div97, file, 296, 3, 13721);
    			attr_dev(div98, "class", "template svelte-zdav59");
    			add_location(div98, file, 294, 2, 13648);
    			attr_dev(img50, "class", "titlelogo svelte-zdav59");
    			if (!src_url_equal(img50.src, img50_src_value = "logo.png")) attr_dev(img50, "src", img50_src_value);
    			attr_dev(img50, "alt", "logo");
    			attr_dev(img50, "unselectable", "on");
    			attr_dev(img50, "height", "30px");
    			add_location(img50, file, 300, 45, 13997);
    			attr_dev(br22, "class", "svelte-zdav59");
    			add_location(br22, file, 300, 126, 14078);
    			attr_dev(div99, "class", "templatetext svelte-zdav59");
    			add_location(div99, file, 300, 3, 13955);
    			attr_dev(div100, "class", "template svelte-zdav59");
    			add_location(div100, file, 298, 2, 13882);
    			attr_dev(img51, "class", "titlelogo svelte-zdav59");
    			if (!src_url_equal(img51.src, img51_src_value = "5logo.png")) attr_dev(img51, "src", img51_src_value);
    			attr_dev(img51, "alt", "logo");
    			attr_dev(img51, "unselectable", "on");
    			attr_dev(img51, "height", "30px");
    			add_location(img51, file, 304, 40, 14229);
    			attr_dev(div101, "class", "templatetext svelte-zdav59");
    			add_location(div101, file, 304, 3, 14192);
    			attr_dev(div102, "class", "template svelte-zdav59");
    			add_location(div102, file, 302, 2, 14119);
    			attr_dev(img52, "class", "titlelogo svelte-zdav59");
    			if (!src_url_equal(img52.src, img52_src_value = "logo.png")) attr_dev(img52, "src", img52_src_value);
    			attr_dev(img52, "alt", "logo");
    			attr_dev(img52, "unselectable", "on");
    			attr_dev(img52, "height", "30px");
    			add_location(img52, file, 308, 43, 14441);
    			attr_dev(div103, "class", "templatetext svelte-zdav59");
    			add_location(div103, file, 308, 3, 14401);
    			attr_dev(div104, "class", "template svelte-zdav59");
    			add_location(div104, file, 306, 2, 14329);
    			attr_dev(img53, "class", "titlelogo svelte-zdav59");
    			if (!src_url_equal(img53.src, img53_src_value = "idlogo.png")) attr_dev(img53, "src", img53_src_value);
    			attr_dev(img53, "alt", "logo");
    			attr_dev(img53, "unselectable", "on");
    			attr_dev(img53, "height", "30px");
    			add_location(img53, file, 312, 45, 14655);
    			attr_dev(div105, "class", "templatetext svelte-zdav59");
    			add_location(div105, file, 312, 3, 14613);
    			attr_dev(div106, "class", "template svelte-zdav59");
    			add_location(div106, file, 310, 2, 14540);
    			attr_dev(img54, "class", "titlelogo svelte-zdav59");
    			if (!src_url_equal(img54.src, img54_src_value = "dlogo.png")) attr_dev(img54, "src", img54_src_value);
    			attr_dev(img54, "alt", "logo");
    			attr_dev(img54, "unselectable", "on");
    			attr_dev(img54, "height", "30px");
    			add_location(img54, file, 316, 50, 14876);
    			attr_dev(br23, "class", "svelte-zdav59");
    			add_location(br23, file, 316, 132, 14958);
    			attr_dev(div107, "class", "templatetext svelte-zdav59");
    			add_location(div107, file, 316, 3, 14829);
    			attr_dev(div108, "class", "template svelte-zdav59");
    			add_location(div108, file, 314, 2, 14756);
    			attr_dev(img55, "class", "titlelogo svelte-zdav59");
    			if (!src_url_equal(img55.src, img55_src_value = "dlogo.png")) attr_dev(img55, "src", img55_src_value);
    			attr_dev(img55, "alt", "logo");
    			attr_dev(img55, "unselectable", "on");
    			attr_dev(img55, "height", "30px");
    			add_location(img55, file, 320, 42, 15096);
    			attr_dev(div109, "class", "templatetext svelte-zdav59");
    			add_location(div109, file, 320, 3, 15057);
    			attr_dev(div110, "class", "template svelte-zdav59");
    			add_location(div110, file, 318, 2, 14984);
    			attr_dev(img56, "class", "titlelogo svelte-zdav59");
    			if (!src_url_equal(img56.src, img56_src_value = "dlogo.png")) attr_dev(img56, "src", img56_src_value);
    			attr_dev(img56, "alt", "logo");
    			attr_dev(img56, "unselectable", "on");
    			attr_dev(img56, "height", "30px");
    			add_location(img56, file, 324, 42, 15308);
    			attr_dev(div111, "class", "templatetext svelte-zdav59");
    			add_location(div111, file, 324, 3, 15269);
    			attr_dev(div112, "class", "template svelte-zdav59");
    			add_location(div112, file, 322, 2, 15196);
    			attr_dev(src, "class", "svelte-zdav59");
    			add_location(src, file, 400, 1, 17184);
    			attr_dev(div113, "class", "grid svelte-zdav59");
    			set_style(div113, "display", /*showdokumentärer*/ ctx[8] ? "" : "none");
    			add_location(div113, file, 285, 1, 13090);
    			attr_dev(main, "class", "svelte-zdav59");
    			add_location(main, file, 45, 2, 1049);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, link, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, main, anchor);
    			append_dev(main, h1);
    			append_dev(h1, img0);
    			append_dev(h1, t1);
    			append_dev(main, t2);
    			append_dev(main, div0);
    			append_dev(main, t3);
    			append_dev(main, button0);
    			append_dev(main, t5);
    			append_dev(main, button1);
    			append_dev(main, t7);
    			append_dev(main, button2);
    			append_dev(main, t9);
    			append_dev(main, button3);
    			append_dev(main, t11);
    			append_dev(main, div1);
    			append_dev(div1, t10_1);
    			append_dev(main, t13);
    			append_dev(main, div22);
    			append_dev(div22, div3);
    			mount_component(thumbnail0, div3, null);
    			append_dev(div3, t14);
    			append_dev(div3, div2);
    			append_dev(div2, t15);
    			append_dev(div2, img1);
    			append_dev(div22, t16);
    			append_dev(div22, div5);
    			mount_component(thumbnail1, div5, null);
    			append_dev(div5, t17);
    			append_dev(div5, div4);
    			append_dev(div4, t18);
    			append_dev(div4, img2);
    			append_dev(div22, t19);
    			append_dev(div22, div7);
    			mount_component(thumbnail2, div7, null);
    			append_dev(div7, t20);
    			append_dev(div7, div6);
    			append_dev(div6, t21);
    			append_dev(div6, img3);
    			append_dev(div6, br0);
    			append_dev(div6, t22);
    			append_dev(div22, t23);
    			append_dev(div22, div9);
    			mount_component(thumbnail3, div9, null);
    			append_dev(div9, t24);
    			append_dev(div9, div8);
    			append_dev(div8, t25);
    			append_dev(div8, img4);
    			append_dev(div22, t26);
    			append_dev(div22, div11);
    			mount_component(thumbnail4, div11, null);
    			append_dev(div11, t27);
    			append_dev(div11, div10);
    			append_dev(div10, t28);
    			append_dev(div10, img5);
    			append_dev(div22, t29);
    			append_dev(div22, div13);
    			mount_component(thumbnail5, div13, null);
    			append_dev(div13, t30);
    			append_dev(div13, div12);
    			append_dev(div12, t31);
    			append_dev(div12, img6);
    			append_dev(div12, br1);
    			append_dev(div12, t32);
    			append_dev(div22, t33);
    			append_dev(div22, div15);
    			mount_component(thumbnail6, div15, null);
    			append_dev(div15, t34);
    			append_dev(div15, div14);
    			append_dev(div14, t35);
    			append_dev(div14, img7);
    			append_dev(div14, br2);
    			append_dev(div14, t36);
    			append_dev(div22, t37);
    			append_dev(div22, div17);
    			mount_component(thumbnail7, div17, null);
    			append_dev(div17, t38);
    			append_dev(div17, div16);
    			append_dev(div16, t39);
    			append_dev(div16, img8);
    			append_dev(div16, br3);
    			append_dev(div16, t40);
    			append_dev(div22, t41);
    			append_dev(div22, div19);
    			mount_component(thumbnail8, div19, null);
    			append_dev(div19, t42);
    			append_dev(div19, div18);
    			append_dev(div18, t43);
    			append_dev(div18, img9);
    			append_dev(div22, t44);
    			append_dev(div22, div21);
    			mount_component(thumbnail9, div21, null);
    			append_dev(div21, t45);
    			append_dev(div21, div20);
    			append_dev(div20, t46);
    			append_dev(div20, img10);
    			append_dev(main, t47);
    			append_dev(main, div23);
    			append_dev(div23, t11_1);
    			append_dev(main, t49);
    			append_dev(main, div44);
    			append_dev(div44, div25);
    			mount_component(thumbnail10, div25, null);
    			append_dev(div25, t50);
    			append_dev(div25, div24);
    			append_dev(div24, t51);
    			append_dev(div24, img11);
    			append_dev(div24, br4);
    			append_dev(div24, t52);
    			append_dev(div44, t53);
    			append_dev(div44, div27);
    			mount_component(thumbnail11, div27, null);
    			append_dev(div27, t54);
    			append_dev(div27, div26);
    			append_dev(div26, t55);
    			append_dev(div26, img12);
    			append_dev(div26, br5);
    			append_dev(div26, t56);
    			append_dev(div44, t57);
    			append_dev(div44, div29);
    			mount_component(thumbnail12, div29, null);
    			append_dev(div29, t58);
    			append_dev(div29, div28);
    			append_dev(div28, t59);
    			append_dev(div28, img13);
    			append_dev(div44, t60);
    			append_dev(div44, div31);
    			mount_component(thumbnail13, div31, null);
    			append_dev(div31, t61);
    			append_dev(div31, div30);
    			append_dev(div30, t62);
    			append_dev(div30, img14);
    			append_dev(div44, t63);
    			append_dev(div44, div33);
    			mount_component(thumbnail14, div33, null);
    			append_dev(div33, t64);
    			append_dev(div33, div32);
    			append_dev(div32, t65);
    			append_dev(div32, img15);
    			append_dev(div32, br6);
    			append_dev(div32, t66);
    			append_dev(div44, t67);
    			append_dev(div44, div35);
    			mount_component(thumbnail15, div35, null);
    			append_dev(div35, t68);
    			append_dev(div35, div34);
    			append_dev(div34, t69);
    			append_dev(div34, img16);
    			append_dev(div34, br7);
    			append_dev(div34, t70);
    			append_dev(div44, t71);
    			append_dev(div44, div37);
    			mount_component(thumbnail16, div37, null);
    			append_dev(div37, t72);
    			append_dev(div37, div36);
    			append_dev(div36, t73);
    			append_dev(div36, img17);
    			append_dev(div36, br8);
    			append_dev(div36, t74);
    			append_dev(div44, t75);
    			append_dev(div44, div39);
    			mount_component(thumbnail17, div39, null);
    			append_dev(div39, t76);
    			append_dev(div39, div38);
    			append_dev(div38, t77);
    			append_dev(div38, img18);
    			append_dev(div38, br9);
    			append_dev(div38, t78);
    			append_dev(div44, t79);
    			append_dev(div44, div41);
    			mount_component(thumbnail18, div41, null);
    			append_dev(div41, t80);
    			append_dev(div41, div40);
    			append_dev(div40, t81);
    			append_dev(div40, img19);
    			append_dev(div40, br10);
    			append_dev(div40, t82);
    			append_dev(div44, t83);
    			append_dev(div44, div43);
    			mount_component(thumbnail19, div43, null);
    			append_dev(div43, t84);
    			append_dev(div43, div42);
    			append_dev(div42, t85);
    			append_dev(div42, img20);
    			append_dev(div42, br11);
    			append_dev(div42, t86);
    			append_dev(main, t87);
    			append_dev(main, div45);
    			append_dev(div45, t12_1);
    			append_dev(main, t89);
    			append_dev(main, div66);
    			append_dev(div66, div47);
    			mount_component(thumbnail20, div47, null);
    			append_dev(div47, t90);
    			append_dev(div47, div46);
    			append_dev(div46, t91);
    			append_dev(div46, img21);
    			append_dev(div66, t92);
    			append_dev(div66, div49);
    			mount_component(thumbnail21, div49, null);
    			append_dev(div49, t93);
    			append_dev(div49, div48);
    			append_dev(div48, t94);
    			append_dev(div48, img22);
    			append_dev(div66, t95);
    			append_dev(div66, div51);
    			mount_component(thumbnail22, div51, null);
    			append_dev(div51, t96);
    			append_dev(div51, div50);
    			append_dev(div50, t97);
    			append_dev(div50, img23);
    			append_dev(div66, t98);
    			append_dev(div66, div53);
    			mount_component(thumbnail23, div53, null);
    			append_dev(div53, t99);
    			append_dev(div53, div52);
    			append_dev(div52, t100);
    			append_dev(div52, img24);
    			append_dev(div66, t101);
    			append_dev(div66, div55);
    			mount_component(thumbnail24, div55, null);
    			append_dev(div55, t102);
    			append_dev(div55, div54);
    			append_dev(div54, t103);
    			append_dev(div54, img25);
    			append_dev(div54, br12);
    			append_dev(div54, t104);
    			append_dev(div66, t105);
    			append_dev(div66, div57);
    			mount_component(thumbnail25, div57, null);
    			append_dev(div57, t106);
    			append_dev(div57, div56);
    			append_dev(div56, t107);
    			append_dev(div56, img26);
    			append_dev(div56, br13);
    			append_dev(div56, t108);
    			append_dev(div66, t109);
    			append_dev(div66, div59);
    			mount_component(thumbnail26, div59, null);
    			append_dev(div59, t110);
    			append_dev(div59, div58);
    			append_dev(div58, t111);
    			append_dev(div58, img27);
    			append_dev(div66, t112);
    			append_dev(div66, div61);
    			mount_component(thumbnail27, div61, null);
    			append_dev(div61, t113);
    			append_dev(div61, div60);
    			append_dev(div60, t114);
    			append_dev(div60, img28);
    			append_dev(div66, t115);
    			append_dev(div66, div63);
    			mount_component(thumbnail28, div63, null);
    			append_dev(div63, t116);
    			append_dev(div63, div62);
    			append_dev(div62, t117);
    			append_dev(div62, img29);
    			append_dev(div66, t118);
    			append_dev(div66, div65);
    			mount_component(thumbnail29, div65, null);
    			append_dev(div65, t119);
    			append_dev(div65, div64);
    			append_dev(div64, t120);
    			append_dev(div64, img30);
    			append_dev(main, t121);
    			append_dev(main, div69);
    			append_dev(div69, button4);
    			append_dev(button4, img31);
    			append_dev(div69, t122);
    			append_dev(div69, button5);
    			append_dev(button5, img32);
    			append_dev(div69, t123);
    			append_dev(div69, button6);
    			append_dev(button6, t124);
    			append_dev(div69, t125);
    			append_dev(div69, div67);
    			append_dev(div67, img33);
    			append_dev(div67, t126);
    			append_dev(div67, img34);
    			append_dev(div69, t127);
    			append_dev(div69, button7);
    			append_dev(button7, t128);
    			append_dev(div69, t129);
    			append_dev(div69, div68);
    			append_dev(div68, img35);
    			append_dev(div68, t130);
    			append_dev(div68, img36);
    			append_dev(main, t131);
    			append_dev(main, div70);
    			append_dev(div70, t13_1);
    			append_dev(main, t133);
    			append_dev(main, div91);
    			append_dev(div91, div72);
    			mount_component(thumbnail30, div72, null);
    			append_dev(div72, t134);
    			append_dev(div72, div71);
    			append_dev(div71, t135);
    			append_dev(div71, img37);
    			append_dev(div91, t136);
    			append_dev(div91, div74);
    			mount_component(thumbnail31, div74, null);
    			append_dev(div74, t137);
    			append_dev(div74, div73);
    			append_dev(div73, t138);
    			append_dev(div73, img38);
    			append_dev(div91, t139);
    			append_dev(div91, div76);
    			mount_component(thumbnail32, div76, null);
    			append_dev(div76, t140);
    			append_dev(div76, div75);
    			append_dev(div75, t141);
    			append_dev(div75, img39);
    			append_dev(div91, t142);
    			append_dev(div91, div78);
    			mount_component(thumbnail33, div78, null);
    			append_dev(div78, t143);
    			append_dev(div78, div77);
    			append_dev(div77, t144);
    			append_dev(div77, img40);
    			append_dev(div77, br14);
    			append_dev(div77, t145);
    			append_dev(div91, t146);
    			append_dev(div91, div80);
    			mount_component(thumbnail34, div80, null);
    			append_dev(div80, t147);
    			append_dev(div80, div79);
    			append_dev(div79, t148);
    			append_dev(div79, img41);
    			append_dev(div79, br15);
    			append_dev(div79, t149);
    			append_dev(div91, t150);
    			append_dev(div91, div82);
    			mount_component(thumbnail35, div82, null);
    			append_dev(div82, t151);
    			append_dev(div82, div81);
    			append_dev(div81, t152);
    			append_dev(div81, img42);
    			append_dev(div81, br16);
    			append_dev(div81, t153);
    			append_dev(div91, t154);
    			append_dev(div91, div84);
    			mount_component(thumbnail36, div84, null);
    			append_dev(div84, t155);
    			append_dev(div84, div83);
    			append_dev(div83, t156);
    			append_dev(div83, img43);
    			append_dev(div91, t157);
    			append_dev(div91, div86);
    			mount_component(thumbnail37, div86, null);
    			append_dev(div86, t158);
    			append_dev(div86, div85);
    			append_dev(div85, t159);
    			append_dev(div85, img44);
    			append_dev(div85, br17);
    			append_dev(div85, t160);
    			append_dev(div91, t161);
    			append_dev(div91, div88);
    			mount_component(thumbnail38, div88, null);
    			append_dev(div88, t162);
    			append_dev(div88, div87);
    			append_dev(div87, t163);
    			append_dev(div87, img45);
    			append_dev(div91, t164);
    			append_dev(div91, div90);
    			mount_component(thumbnail39, div90, null);
    			append_dev(div90, t165);
    			append_dev(div90, div89);
    			append_dev(div89, t166);
    			append_dev(div89, img46);
    			append_dev(div89, br18);
    			append_dev(div89, t167);
    			append_dev(main, t168);
    			append_dev(main, div92);
    			append_dev(div92, t14_1);
    			append_dev(main, t170);
    			append_dev(main, div113);
    			append_dev(div113, div94);
    			mount_component(thumbnail40, div94, null);
    			append_dev(div94, t171);
    			append_dev(div94, div93);
    			append_dev(div93, t172);
    			append_dev(div93, img47);
    			append_dev(div93, br19);
    			append_dev(div93, t173);
    			append_dev(div113, t174);
    			append_dev(div113, div96);
    			mount_component(thumbnail41, div96, null);
    			append_dev(div96, t175);
    			append_dev(div96, div95);
    			append_dev(div95, t176);
    			append_dev(div95, img48);
    			append_dev(div95, br20);
    			append_dev(div95, t177);
    			append_dev(div113, t178);
    			append_dev(div113, div98);
    			mount_component(thumbnail42, div98, null);
    			append_dev(div98, t179);
    			append_dev(div98, div97);
    			append_dev(div97, t180);
    			append_dev(div97, img49);
    			append_dev(div97, br21);
    			append_dev(div97, t181);
    			append_dev(div113, t182);
    			append_dev(div113, div100);
    			mount_component(thumbnail43, div100, null);
    			append_dev(div100, t183);
    			append_dev(div100, div99);
    			append_dev(div99, t184);
    			append_dev(div99, img50);
    			append_dev(div99, br22);
    			append_dev(div99, t185);
    			append_dev(div113, t186);
    			append_dev(div113, div102);
    			mount_component(thumbnail44, div102, null);
    			append_dev(div102, t187);
    			append_dev(div102, div101);
    			append_dev(div101, t188);
    			append_dev(div101, img51);
    			append_dev(div113, t189);
    			append_dev(div113, div104);
    			mount_component(thumbnail45, div104, null);
    			append_dev(div104, t190);
    			append_dev(div104, div103);
    			append_dev(div103, t191);
    			append_dev(div103, img52);
    			append_dev(div113, t192);
    			append_dev(div113, div106);
    			mount_component(thumbnail46, div106, null);
    			append_dev(div106, t193);
    			append_dev(div106, div105);
    			append_dev(div105, t194);
    			append_dev(div105, img53);
    			append_dev(div113, t195);
    			append_dev(div113, div108);
    			mount_component(thumbnail47, div108, null);
    			append_dev(div108, t196);
    			append_dev(div108, div107);
    			append_dev(div107, t197);
    			append_dev(div107, img54);
    			append_dev(div107, br23);
    			append_dev(div107, t198);
    			append_dev(div113, t199);
    			append_dev(div113, div110);
    			mount_component(thumbnail48, div110, null);
    			append_dev(div110, t200);
    			append_dev(div110, div109);
    			append_dev(div109, t201);
    			append_dev(div109, img55);
    			append_dev(div113, t202);
    			append_dev(div113, div112);
    			mount_component(thumbnail49, div112, null);
    			append_dev(div112, t203);
    			append_dev(div112, div111);
    			append_dev(div111, t204);
    			append_dev(div111, img56);
    			append_dev(div113, t205);
    			mount_component(overlay, div113, null);
    			append_dev(div113, t206);
    			append_dev(div113, src);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*click_handler*/ ctx[20], false, false, false),
    					listen_dev(button1, "click", /*click_handler_1*/ ctx[21], false, false, false),
    					listen_dev(button2, "click", /*click_handler_2*/ ctx[22], false, false, false),
    					listen_dev(button3, "click", /*click_handler_3*/ ctx[23], false, false, false),
    					listen_dev(div22, "click", /*showtitle*/ ctx[11], false, false, false),
    					listen_dev(div44, "click", /*showtitle*/ ctx[11], false, false, false),
    					listen_dev(div66, "click", /*showtitle*/ ctx[11], false, false, false),
    					listen_dev(button4, "click", /*click_handler_4*/ ctx[24], false, false, false),
    					listen_dev(button5, "click", /*click_handler_5*/ ctx[25], false, false, false),
    					listen_dev(button6, "click", /*showBanner*/ ctx[12], false, false, false),
    					listen_dev(button7, "click", /*hideBanner*/ ctx[13], false, false, false),
    					listen_dev(div91, "click", /*showtitle*/ ctx[11], false, false, false),
    					listen_dev(div113, "click", /*showtitle*/ ctx[11], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*visibility*/ 2) {
    				set_style(h1, "display", /*visibility*/ ctx[1] ? "" : "none");
    			}

    			if (!current || dirty & /*showutvalt*/ 16) {
    				set_style(div1, "display", /*showutvalt*/ ctx[4] ? "" : "none");
    			}

    			if (!current || dirty & /*showutvalt*/ 16) {
    				set_style(div22, "display", /*showutvalt*/ ctx[4] ? "" : "none");
    			}

    			if (!current || dirty & /*shownyheter*/ 32) {
    				set_style(div23, "display", /*shownyheter*/ ctx[5] ? "" : "none");
    			}

    			if (!current || dirty & /*shownyheter*/ 32) {
    				set_style(div44, "display", /*shownyheter*/ ctx[5] ? "" : "none");
    			}

    			if (!current || dirty & /*showäventyr*/ 64) {
    				set_style(div45, "display", /*showäventyr*/ ctx[6] ? "" : "none");
    			}

    			if (!current || dirty & /*showäventyr*/ 64) {
    				set_style(div66, "display", /*showäventyr*/ ctx[6] ? "" : "none");
    			}

    			if (!current || dirty & /*show*/ 4) {
    				set_style(button4, "display", /*show*/ ctx[2] ? "none" : "");
    			}

    			if (!current || dirty & /*show*/ 4) {
    				set_style(button5, "display", /*show*/ ctx[2] ? "" : "none");
    			}

    			if (!current || dirty & /*show*/ 4) {
    				set_style(button6, "display", /*show*/ ctx[2] ? "none" : "");
    			}

    			if (!current || dirty & /*show*/ 4) {
    				set_style(img33, "display", /*show*/ ctx[2] ? "none" : "");
    			}

    			if (!current || dirty & /*show*/ 4) {
    				set_style(img34, "display", /*show*/ ctx[2] ? "none" : "");
    			}

    			if (!current || dirty & /*show*/ 4) {
    				set_style(div67, "display", /*show*/ ctx[2] ? "none" : "");
    			}

    			if (!current || dirty & /*show*/ 4) {
    				set_style(button7, "display", /*show*/ ctx[2] ? "" : "none");
    			}

    			if (!current || dirty & /*show*/ 4) {
    				set_style(img35, "display", /*show*/ ctx[2] ? "" : "none");
    			}

    			if (!current || dirty & /*show*/ 4) {
    				set_style(img36, "display", /*show*/ ctx[2] ? "" : "none");
    			}

    			if (!current || dirty & /*show*/ 4) {
    				set_style(div68, "display", /*show*/ ctx[2] ? "" : "none");
    			}

    			if (!current || dirty & /*showbanner*/ 8) {
    				set_style(div69, "display", /*showbanner*/ ctx[3] ? "" : "none");
    			}

    			if (!current || dirty & /*showserier*/ 128) {
    				set_style(div70, "display", /*showserier*/ ctx[7] ? "" : "none");
    			}

    			if (!current || dirty & /*showserier*/ 128) {
    				set_style(div91, "display", /*showserier*/ ctx[7] ? "" : "none");
    			}

    			if (!current || dirty & /*showdokumentärer*/ 256) {
    				set_style(div92, "display", /*showdokumentärer*/ ctx[8] ? "" : "none");
    			}

    			const overlay_changes = {};
    			if (dirty & /*is_fullscreen*/ 1) overlay_changes.opacity = /*is_fullscreen*/ ctx[0] ? 1 : 0.7;
    			if (dirty & /*$video_player_is_active*/ 1024) overlay_changes.active = /*$video_player_is_active*/ ctx[10];

    			if (dirty & /*$$scope, is_fullscreen, $video_player_is_active, visibility*/ 1073742851) {
    				overlay_changes.$$scope = { dirty, ctx };
    			}

    			overlay.$set(overlay_changes);

    			if (!current || dirty & /*showdokumentärer*/ 256) {
    				set_style(div113, "display", /*showdokumentärer*/ ctx[8] ? "" : "none");
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(thumbnail0.$$.fragment, local);
    			transition_in(thumbnail1.$$.fragment, local);
    			transition_in(thumbnail2.$$.fragment, local);
    			transition_in(thumbnail3.$$.fragment, local);
    			transition_in(thumbnail4.$$.fragment, local);
    			transition_in(thumbnail5.$$.fragment, local);
    			transition_in(thumbnail6.$$.fragment, local);
    			transition_in(thumbnail7.$$.fragment, local);
    			transition_in(thumbnail8.$$.fragment, local);
    			transition_in(thumbnail9.$$.fragment, local);
    			transition_in(thumbnail10.$$.fragment, local);
    			transition_in(thumbnail11.$$.fragment, local);
    			transition_in(thumbnail12.$$.fragment, local);
    			transition_in(thumbnail13.$$.fragment, local);
    			transition_in(thumbnail14.$$.fragment, local);
    			transition_in(thumbnail15.$$.fragment, local);
    			transition_in(thumbnail16.$$.fragment, local);
    			transition_in(thumbnail17.$$.fragment, local);
    			transition_in(thumbnail18.$$.fragment, local);
    			transition_in(thumbnail19.$$.fragment, local);
    			transition_in(thumbnail20.$$.fragment, local);
    			transition_in(thumbnail21.$$.fragment, local);
    			transition_in(thumbnail22.$$.fragment, local);
    			transition_in(thumbnail23.$$.fragment, local);
    			transition_in(thumbnail24.$$.fragment, local);
    			transition_in(thumbnail25.$$.fragment, local);
    			transition_in(thumbnail26.$$.fragment, local);
    			transition_in(thumbnail27.$$.fragment, local);
    			transition_in(thumbnail28.$$.fragment, local);
    			transition_in(thumbnail29.$$.fragment, local);
    			transition_in(thumbnail30.$$.fragment, local);
    			transition_in(thumbnail31.$$.fragment, local);
    			transition_in(thumbnail32.$$.fragment, local);
    			transition_in(thumbnail33.$$.fragment, local);
    			transition_in(thumbnail34.$$.fragment, local);
    			transition_in(thumbnail35.$$.fragment, local);
    			transition_in(thumbnail36.$$.fragment, local);
    			transition_in(thumbnail37.$$.fragment, local);
    			transition_in(thumbnail38.$$.fragment, local);
    			transition_in(thumbnail39.$$.fragment, local);
    			transition_in(thumbnail40.$$.fragment, local);
    			transition_in(thumbnail41.$$.fragment, local);
    			transition_in(thumbnail42.$$.fragment, local);
    			transition_in(thumbnail43.$$.fragment, local);
    			transition_in(thumbnail44.$$.fragment, local);
    			transition_in(thumbnail45.$$.fragment, local);
    			transition_in(thumbnail46.$$.fragment, local);
    			transition_in(thumbnail47.$$.fragment, local);
    			transition_in(thumbnail48.$$.fragment, local);
    			transition_in(thumbnail49.$$.fragment, local);
    			transition_in(overlay.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(thumbnail0.$$.fragment, local);
    			transition_out(thumbnail1.$$.fragment, local);
    			transition_out(thumbnail2.$$.fragment, local);
    			transition_out(thumbnail3.$$.fragment, local);
    			transition_out(thumbnail4.$$.fragment, local);
    			transition_out(thumbnail5.$$.fragment, local);
    			transition_out(thumbnail6.$$.fragment, local);
    			transition_out(thumbnail7.$$.fragment, local);
    			transition_out(thumbnail8.$$.fragment, local);
    			transition_out(thumbnail9.$$.fragment, local);
    			transition_out(thumbnail10.$$.fragment, local);
    			transition_out(thumbnail11.$$.fragment, local);
    			transition_out(thumbnail12.$$.fragment, local);
    			transition_out(thumbnail13.$$.fragment, local);
    			transition_out(thumbnail14.$$.fragment, local);
    			transition_out(thumbnail15.$$.fragment, local);
    			transition_out(thumbnail16.$$.fragment, local);
    			transition_out(thumbnail17.$$.fragment, local);
    			transition_out(thumbnail18.$$.fragment, local);
    			transition_out(thumbnail19.$$.fragment, local);
    			transition_out(thumbnail20.$$.fragment, local);
    			transition_out(thumbnail21.$$.fragment, local);
    			transition_out(thumbnail22.$$.fragment, local);
    			transition_out(thumbnail23.$$.fragment, local);
    			transition_out(thumbnail24.$$.fragment, local);
    			transition_out(thumbnail25.$$.fragment, local);
    			transition_out(thumbnail26.$$.fragment, local);
    			transition_out(thumbnail27.$$.fragment, local);
    			transition_out(thumbnail28.$$.fragment, local);
    			transition_out(thumbnail29.$$.fragment, local);
    			transition_out(thumbnail30.$$.fragment, local);
    			transition_out(thumbnail31.$$.fragment, local);
    			transition_out(thumbnail32.$$.fragment, local);
    			transition_out(thumbnail33.$$.fragment, local);
    			transition_out(thumbnail34.$$.fragment, local);
    			transition_out(thumbnail35.$$.fragment, local);
    			transition_out(thumbnail36.$$.fragment, local);
    			transition_out(thumbnail37.$$.fragment, local);
    			transition_out(thumbnail38.$$.fragment, local);
    			transition_out(thumbnail39.$$.fragment, local);
    			transition_out(thumbnail40.$$.fragment, local);
    			transition_out(thumbnail41.$$.fragment, local);
    			transition_out(thumbnail42.$$.fragment, local);
    			transition_out(thumbnail43.$$.fragment, local);
    			transition_out(thumbnail44.$$.fragment, local);
    			transition_out(thumbnail45.$$.fragment, local);
    			transition_out(thumbnail46.$$.fragment, local);
    			transition_out(thumbnail47.$$.fragment, local);
    			transition_out(thumbnail48.$$.fragment, local);
    			transition_out(thumbnail49.$$.fragment, local);
    			transition_out(overlay.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(link);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(main);
    			destroy_component(thumbnail0);
    			destroy_component(thumbnail1);
    			destroy_component(thumbnail2);
    			destroy_component(thumbnail3);
    			destroy_component(thumbnail4);
    			destroy_component(thumbnail5);
    			destroy_component(thumbnail6);
    			destroy_component(thumbnail7);
    			destroy_component(thumbnail8);
    			destroy_component(thumbnail9);
    			destroy_component(thumbnail10);
    			destroy_component(thumbnail11);
    			destroy_component(thumbnail12);
    			destroy_component(thumbnail13);
    			destroy_component(thumbnail14);
    			destroy_component(thumbnail15);
    			destroy_component(thumbnail16);
    			destroy_component(thumbnail17);
    			destroy_component(thumbnail18);
    			destroy_component(thumbnail19);
    			destroy_component(thumbnail20);
    			destroy_component(thumbnail21);
    			destroy_component(thumbnail22);
    			destroy_component(thumbnail23);
    			destroy_component(thumbnail24);
    			destroy_component(thumbnail25);
    			destroy_component(thumbnail26);
    			destroy_component(thumbnail27);
    			destroy_component(thumbnail28);
    			destroy_component(thumbnail29);
    			destroy_component(thumbnail30);
    			destroy_component(thumbnail31);
    			destroy_component(thumbnail32);
    			destroy_component(thumbnail33);
    			destroy_component(thumbnail34);
    			destroy_component(thumbnail35);
    			destroy_component(thumbnail36);
    			destroy_component(thumbnail37);
    			destroy_component(thumbnail38);
    			destroy_component(thumbnail39);
    			destroy_component(thumbnail40);
    			destroy_component(thumbnail41);
    			destroy_component(thumbnail42);
    			destroy_component(thumbnail43);
    			destroy_component(thumbnail44);
    			destroy_component(thumbnail45);
    			destroy_component(thumbnail46);
    			destroy_component(thumbnail47);
    			destroy_component(thumbnail48);
    			destroy_component(thumbnail49);
    			destroy_component(overlay);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const click_handler_9 = e => {
    	e.stopPropagation();
    };

    function instance($$self, $$props, $$invalidate) {
    	let $chosen_video;
    	let $video_player_is_active;
    	validate_store(chosen_video, 'chosen_video');
    	component_subscribe($$self, chosen_video, $$value => $$invalidate(9, $chosen_video = $$value));
    	validate_store(video_player_is_active, 'video_player_is_active');
    	component_subscribe($$self, video_player_is_active, $$value => $$invalidate(10, $video_player_is_active = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let is_fullscreen = false;
    	let visibility = true;
    	let show = false;
    	let showbanner = true;
    	let showutvalt = true;
    	let shownyheter = true;
    	let showäventyr = true;
    	let showserier = true;
    	let showdokumentärer = true;

    	function showtitle() {
    		$$invalidate(1, visibility = false);
    	}

    	function showBanner() {
    		$$invalidate(2, show = true);
    	}

    	function hideBanner() {
    		$$invalidate(2, show = false);
    	}

    	function hidebanner() {
    		$$invalidate(3, showbanner = false);
    	}

    	function hideutvalt() {
    		$$invalidate(4, showutvalt = false);
    	}

    	function hidenyheter() {
    		$$invalidate(5, shownyheter = false);
    	}

    	function hideäventyr() {
    		$$invalidate(6, showäventyr = false);
    	}

    	function hideserier() {
    		$$invalidate(7, showserier = false);
    	}

    	function hidedokumentärer() {
    		$$invalidate(8, showdokumentärer = false);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => {
    		hideutvalt();
    		hideäventyr();
    		hidenyheter();
    		hideserier();
    		hidebanner();
    		$$invalidate(8, showdokumentärer = true);
    	};

    	const click_handler_1 = () => {
    		hideutvalt();
    		hideäventyr();
    		hidedokumentärer();
    		hideserier();
    		hidebanner();
    		$$invalidate(5, shownyheter = true);
    	};

    	const click_handler_2 = () => {
    		hideutvalt();
    		hidenyheter();
    		hideäventyr();
    		hidedokumentärer();
    		hidebanner();
    		$$invalidate(7, showserier = true);
    	};

    	const click_handler_3 = () => {
    		$$invalidate(4, showutvalt = true);
    		$$invalidate(5, shownyheter = true);
    		$$invalidate(6, showäventyr = true);
    		$$invalidate(7, showserier = true);
    		$$invalidate(8, showdokumentärer = true);
    		$$invalidate(3, showbanner = true);
    	};

    	const click_handler_4 = () => {
    		set_store_value(chosen_video, $chosen_video = videos[2], $chosen_video);
    		set_store_value(video_player_is_active, $video_player_is_active = true, $video_player_is_active);
    		$$invalidate(1, visibility = false);
    	};

    	const click_handler_5 = () => {
    		set_store_value(chosen_video, $chosen_video = videos[7], $chosen_video);
    		set_store_value(video_player_is_active, $video_player_is_active = true, $video_player_is_active);
    		$$invalidate(1, visibility = false);
    	};

    	const click_handler_6 = () => {
    		set_store_value(video_player_is_active, $video_player_is_active = false, $video_player_is_active);
    		$$invalidate(1, visibility = true);
    	};

    	const click_handler_7 = () => {
    		$$invalidate(0, is_fullscreen = !is_fullscreen);

    		// do not focus the fullscreenbutton if clicked
    		// this is because otherwise clicking space will cause
    		// the video player to maximize/minimize instead of pause/play
    		// when space is clicked
    		if (document.activeElement != document.body) document.activeElement.blur();
    	};

    	const click_handler_8 = () => {
    		// do not focus the fullscreenbutton if clicked
    		// this is because otherwise clicking space will cause
    		// the video player to maximize/minimize instead of pause/play
    		// when space is clicked
    		if (document.activeElement != document.body) document.activeElement.blur();

    		let div = document.getElementById("vid");
    		if (div.requestFullscreen) div.requestFullscreen(); else if (div.webkitRequestFullscreen) div.webkitRequestFullscreen(); else if (div.msRequestFullScreen) div.msRequestFullScreen();
    	};

    	const click_handler_10 = () => {
    		set_store_value(video_player_is_active, $video_player_is_active = false, $video_player_is_active);
    	};

    	$$self.$capture_state = () => ({
    		video_player_is_active,
    		chosen_video,
    		Button,
    		Overlay,
    		videos,
    		Player,
    		Thumbnail,
    		is_fullscreen,
    		visibility,
    		show,
    		showbanner,
    		showutvalt,
    		shownyheter,
    		showäventyr,
    		showserier,
    		showdokumentärer,
    		showtitle,
    		showBanner,
    		hideBanner,
    		hidebanner,
    		hideutvalt,
    		hidenyheter,
    		hideäventyr,
    		hideserier,
    		hidedokumentärer,
    		$chosen_video,
    		$video_player_is_active
    	});

    	$$self.$inject_state = $$props => {
    		if ('is_fullscreen' in $$props) $$invalidate(0, is_fullscreen = $$props.is_fullscreen);
    		if ('visibility' in $$props) $$invalidate(1, visibility = $$props.visibility);
    		if ('show' in $$props) $$invalidate(2, show = $$props.show);
    		if ('showbanner' in $$props) $$invalidate(3, showbanner = $$props.showbanner);
    		if ('showutvalt' in $$props) $$invalidate(4, showutvalt = $$props.showutvalt);
    		if ('shownyheter' in $$props) $$invalidate(5, shownyheter = $$props.shownyheter);
    		if ('showäventyr' in $$props) $$invalidate(6, showäventyr = $$props.showäventyr);
    		if ('showserier' in $$props) $$invalidate(7, showserier = $$props.showserier);
    		if ('showdokumentärer' in $$props) $$invalidate(8, showdokumentärer = $$props.showdokumentärer);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		is_fullscreen,
    		visibility,
    		show,
    		showbanner,
    		showutvalt,
    		shownyheter,
    		showäventyr,
    		showserier,
    		showdokumentärer,
    		$chosen_video,
    		$video_player_is_active,
    		showtitle,
    		showBanner,
    		hideBanner,
    		hidebanner,
    		hideutvalt,
    		hidenyheter,
    		hideäventyr,
    		hideserier,
    		hidedokumentärer,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3,
    		click_handler_4,
    		click_handler_5,
    		click_handler_6,
    		click_handler_7,
    		click_handler_8,
    		click_handler_10
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
