# Motion and event ownership

Pixi owns canvas cards, pointer drag and table effects. Motion owns DOM dialogs, notifications and result overlays. No dnd-kit: cards are canvas objects and have one drag owner. Rules commit atomically before visualization. Input pacing belongs to the controller, never to rule resolution. Cancel/skip/fast-forward bring the renderer to the latest authoritative projection.

Central durations: hover 120ms, pickup 210ms, play 320ms, flip 300ms, target 260ms, impact 220ms, major effect 520ms, turn 360ms. Ease out cubic, small stagger 45ms. Hand hover lifts 20 logical px and scales 1.07. Selection uses an outline and label as well as color.

Draw travels deck → hand; play travels hand → center → target/discard; Drug binds to Disorder and adds treated stamp; Therapy removes the Disorder with an ink ring; Episode shows target and impact; incoming Disorder marks the vulnerability; victory dims table and reveals result. Shuffle/deal reuse card travel primitives. Every event keeps text history. Particle accents are bounded and no rapid flashing is used.

AnimationQueue returns an awaitable completion, supports pause, cancel, skip, speed and fast-forward. A ticker owns transform interpolation; no React updates per frame. Reduced motion displays final positions immediately. Resource teardown cancels queue, removes listeners/observers, stops ticker and destroys canvas resources. `/dev/animations` and debug controls allow isolated playback, restart, speed 0.25–2x and pause.
