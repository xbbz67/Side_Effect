# Logic, content, and visual assets

**PROPOSED DIGITAL UX / PROJECT POLICY** following Research.txt. Research access is not treated as distribution permission.

Keep headless legality/effects separate from content definitions and replaceable visual/sound assets. The downloaded publisher booklet/photos and sampled video frames in `research/evidence` are research references. They must not be automatically copied to a web build, CDN, bundle or public replay package. No artwork license or publisher permission has been established.

Use original placeholder illustrations, simple type/icon/color layouts and original/licensed sounds in development. Preserve Disorder and Drug relationships as data rather than reading legality from artwork, pixel colors or filenames. Literal full card text remains unknown in the research database; functional descriptions are paraphrases.

## Future manifest example

```json
{
  "assetSetId": "original-placeholders-v1",
  "cards": {
    "depression": {
      "frontAsset": "/assets/placeholders/depression.webp",
      "backAsset": "/assets/placeholders/card-back.webp",
      "altText": "Depression Disorder",
      "licenseRecordId": "original-design-001"
    }
  }
}
```

This is a mapping example, not existing asset paths. Asset manifest changes cannot change card effects, target predicates, copy counts or rules version. Record creator, origin URL if any, license/authorization, attribution requirements, permitted distribution and modified versions for each asset set. Missing art falls back to readable text without breaking play.

Game themes/ingredient names are game content. Do not introduce real-world medical effects as missing card rules. No generated art or production assets were requested or created in this research task.
