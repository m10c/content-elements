import {
  usePreviewSender,
  useWebsiteGlobalData,
  useWebsitePageData
} from "./chunk-CPYWU2ZG.js";

// src/components/BlocksField.tsx
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  InputAdornment,
  Stack,
  Typography
} from "@mui/material";
import { FieldRadioGroup, FieldSwitch, FieldText } from "@m10c/mui-kit";
import React from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function BlocksField({
  blockTypes,
  field,
  renderers,
  previews,
  icons,
  errors
}) {
  const blocks = field.value ?? [];
  const blockTypesByKey = React.useMemo(
    () => Object.fromEntries(
      blockTypes.map((blockType) => [blockType.key, blockType])
    ),
    [blockTypes]
  );
  function updateBlock(index, next) {
    const updated = blocks.slice();
    updated[index] = next;
    field.handleValueChange(updated);
  }
  return /* @__PURE__ */ jsx(Stack, { spacing: 2, children: blocks.map((block, index) => /* @__PURE__ */ jsx(
    BlockCard,
    {
      block,
      blockType: blockTypesByKey[block.type],
      renderers,
      previews,
      icons,
      errors,
      errorPath: String(index),
      onChange: (next) => updateBlock(index, next)
    },
    index
  )) });
}
function BlockCard({
  block,
  blockType,
  renderers,
  previews,
  icons,
  errors,
  errorPath,
  onChange
}) {
  function updateData(key, value) {
    onChange({ ...block, data: { ...block.data, [key]: value } });
  }
  const fields = blockType?.fields ?? {};
  const headerFieldKeys = new Set(
    Object.values(fields).flatMap(
      (fieldDef) => fieldDef.kind === "list" ? fieldDef.headerFieldKeys ?? [] : []
    )
  );
  function renderHeaderFields(fieldDef) {
    if (fieldDef.kind !== "list" || !fieldDef.headerFieldKeys?.length) {
      return void 0;
    }
    const claimed = fieldDef.headerFieldKeys;
    return /* @__PURE__ */ jsx(Fragment, { children: Object.entries(fields).filter(([key]) => claimed.includes(key)).map(
      ([key, headerFieldDef]) => headerFieldDef.kind === "list" ? null : /* @__PURE__ */ jsx(
        SimpleFieldRenderer,
        {
          fieldKey: key,
          fieldDef: headerFieldDef,
          value: block.data[key],
          renderers,
          error: errors?.[`${errorPath}.${key}`],
          onChange: (value) => updateData(key, value)
        },
        key
      )
    ) });
  }
  return /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardContent, { sx: { p: 2.5, "&:last-child": { pb: 2.5 } }, children: /* @__PURE__ */ jsxs(Stack, { spacing: 2, children: [
    !blockType?.hideLabel && /* @__PURE__ */ jsx(Typography, { variant: "subtitle1", children: blockType?.label ?? `Unknown block: ${block.type}` }),
    blockType ? Object.entries(blockType.fields).filter(([key]) => !headerFieldKeys.has(key)).map(([key, fieldDef]) => /* @__PURE__ */ jsx(
      BlockFieldRenderer,
      {
        fieldKey: key,
        fieldDef,
        value: block.data[key],
        renderers,
        previews,
        icons,
        errors,
        errorPath: `${errorPath}.${key}`,
        headerSlot: renderHeaderFields(fieldDef),
        onChange: (value) => updateData(key, value)
      },
      key
    )) : /* @__PURE__ */ jsxs(Typography, { variant: "body2", color: "text.secondary", children: [
      'No schema registered for block type "',
      block.type,
      '".'
    ] })
  ] }) }) });
}
function BlockFieldRenderer({
  fieldKey,
  fieldDef,
  value,
  renderers,
  previews,
  icons,
  errors,
  errorPath,
  headerSlot,
  onChange
}) {
  if (fieldDef.kind === "list") {
    return /* @__PURE__ */ jsx(
      ListFieldRenderer,
      {
        fieldDef,
        value: Array.isArray(value) ? value : [],
        renderers,
        previews,
        icons,
        errors,
        errorPath,
        headerSlot,
        onChange
      }
    );
  }
  return /* @__PURE__ */ jsx(
    SimpleFieldRenderer,
    {
      fieldKey,
      fieldDef,
      value,
      renderers,
      error: errors?.[errorPath],
      onChange
    }
  );
}
function SimpleFieldRenderer({
  fieldKey,
  fieldDef,
  value,
  renderers,
  labelOverride,
  error,
  onChange
}) {
  const label = labelOverride ?? fieldLabel(fieldDef, fieldKey);
  if (fieldDef.kind === "note") {
    return /* @__PURE__ */ jsx(FieldNote, { fieldDef, label });
  }
  const stringValue = typeof value === "string" ? value : null;
  const isOn = value === true;
  const customRenderer = renderers?.[fieldDef.kind];
  if (customRenderer) {
    return /* @__PURE__ */ jsx(Fragment, { children: customRenderer({
      name: fieldKey,
      label,
      value: stringValue,
      features: fieldDef.features,
      hint: fieldDef.hint,
      prefix: fieldDef.prefix,
      error,
      values: stringValues(value),
      maxItems: fieldDef.maxItems,
      checked: isOn,
      onChange,
      onChangeValues: onChange,
      onChangeChecked: onChange
    }) });
  }
  if (fieldDef.kind === "toggle") {
    return /* @__PURE__ */ jsx(FieldWrap, { fieldDef, error, children: /* @__PURE__ */ jsx(
      FieldSwitch,
      {
        field: {
          name: fieldKey,
          label,
          value: isOn,
          handleValueChange: onChange
        }
      }
    ) });
  }
  if (fieldDef.kind === "choice") {
    return /* @__PURE__ */ jsx(FieldWrap, { fieldDef, label, error, children: /* @__PURE__ */ jsx(
      FieldRadioGroup,
      {
        field: {
          name: fieldKey,
          label,
          value: stringValue ?? "",
          handleValueChange: onChange
        },
        options: fieldDef.options ?? []
      }
    ) });
  }
  if (fieldDef.kind === "images") {
    return /* @__PURE__ */ jsx(FieldWrap, { fieldDef, label, error });
  }
  const fieldProp = {
    name: fieldKey,
    label,
    value: stringValue,
    handleValueChange: onChange,
    errorList: error === void 0 ? void 0 : [error]
  };
  const multiline = fieldDef.kind === "textarea" || fieldDef.kind === "markdown" || fieldDef.kind === "richtext";
  return /* @__PURE__ */ jsx(FieldWrap, { fieldDef, label, children: /* @__PURE__ */ jsx(
    FieldText,
    {
      field: fieldProp,
      hiddenLabel: true,
      multiline,
      minRows: multiline ? 2 : void 0,
      InputProps: fieldDef.prefix ? {
        startAdornment: /* @__PURE__ */ jsx(InputAdornment, { position: "start", children: fieldDef.prefix })
      } : void 0,
      inputProps: fieldDef.maxLength ? { maxLength: fieldDef.maxLength } : void 0
    }
  ) });
}
function FieldWrap({ fieldDef, label, error, children }) {
  return /* @__PURE__ */ jsxs(Stack, { spacing: 1, children: [
    /* @__PURE__ */ jsxs(Stack, { spacing: 0.5, children: [
      label && /* @__PURE__ */ jsx(Typography, { variant: "subtitle2", children: label }),
      fieldDef.hint && /* @__PURE__ */ jsx(Typography, { variant: "body2", color: "text.secondary", children: fieldDef.hint })
    ] }),
    children,
    error && /* @__PURE__ */ jsx(FieldError, { error })
  ] });
}
function FieldError({ error }) {
  return /* @__PURE__ */ jsx(Typography, { variant: "caption", color: "error.main", children: error });
}
function FieldNote({
  fieldDef,
  label
}) {
  return /* @__PURE__ */ jsxs(Stack, { spacing: 0.5, children: [
    fieldDef.label && /* @__PURE__ */ jsx(Typography, { variant: "subtitle1", children: label }),
    /* @__PURE__ */ jsx(Typography, { variant: "body2", color: "text.secondary", children: fieldDef.text })
  ] });
}
function stringValues(value) {
  return Array.isArray(value) ? value.filter((item) => typeof item === "string") : [];
}
function fieldLabel(fieldDef, fallback) {
  return `${fieldDef.label ?? fallback}${fieldDef.required ? "*" : ""}`;
}
function fieldSummary(fieldDef, value) {
  if (fieldDef.kind === "toggle") return value === true ? "Yes" : "No";
  if (typeof value !== "string") return null;
  const option = fieldDef.options?.find((item) => item.value === value);
  if (option) return option.label;
  return fieldDef.kind === "richtext" || fieldDef.kind === "markdown" ? plainText(value) : value;
}
function plainText(html) {
  return html.replace(/<br\s*\/?>/gi, " ").replace(/<\/(p|div|li|h[1-6])>/gi, " ").replace(/<[^>]*>/g, "").replace(/&nbsp;/gi, " ").replace(/&amp;/gi, "&").replace(/&lt;/gi, "<").replace(/&gt;/gi, ">").replace(/&quot;/gi, '"').replace(/&#39;/gi, "'").replace(/\s+/g, " ").trim();
}
function emptyItem(fieldDef) {
  return Object.fromEntries(
    Object.entries(fieldDef.itemFields).map(([key, subFieldDef]) => [
      key,
      subFieldDef.kind === "toggle" ? false : ""
    ])
  );
}
function ListFieldRenderer(props) {
  return props.fieldDef.variant === "cards" ? /* @__PURE__ */ jsx(ListCards, { ...props }) : /* @__PURE__ */ jsx(ListInline, { ...props });
}
function ListInline({
  fieldDef,
  value: items,
  renderers,
  errors,
  errorPath,
  onChange
}) {
  const itemLabel = fieldDef.itemLabel ?? fieldDef.label ?? "Item";
  function updateItem(index, next) {
    const updated = items.slice();
    updated[index] = next;
    onChange(updated);
  }
  return /* @__PURE__ */ jsx(Stack, { spacing: 2, children: items.map((item, index) => /* @__PURE__ */ jsxs(React.Fragment, { children: [
    index > 0 && /* @__PURE__ */ jsx(Divider, {}),
    Object.entries(fieldDef.itemFields).map(([subKey, subFieldDef]) => /* @__PURE__ */ jsx(
      SimpleFieldRenderer,
      {
        fieldKey: subKey,
        fieldDef: subFieldDef,
        value: item[subKey],
        renderers,
        labelOverride: `${fieldLabel(subFieldDef, subKey)} ${itemLabel} ${index + 1}`,
        error: errors?.[`${errorPath}.${index}.${subKey}`],
        onChange: (subValue) => updateItem(index, { ...item, [subKey]: subValue })
      },
      subKey
    ))
  ] }, index)) });
}
function ListCards({
  fieldDef,
  value: items,
  renderers,
  previews,
  icons,
  errors,
  errorPath,
  headerSlot,
  onChange
}) {
  const [editedIndex, setEditedIndex] = React.useState(null);
  const [isAdding, setIsAdding] = React.useState(false);
  const [draggedIndex, setDraggedIndex] = React.useState(null);
  const itemLabel = fieldDef.itemLabel ?? "item";
  const editedItem = editedIndex === null ? void 0 : items[editedIndex];
  const { maxItems, minItems } = fieldDef;
  const isFull = maxItems !== void 0 && items.length >= maxItems;
  const canDelete = items.length > (minItems ?? 0);
  const isFixedLength = minItems !== void 0 && minItems === maxItems;
  function itemErrors(index) {
    const prefix = `${errorPath}.${index}.`;
    return Object.fromEntries(
      Object.entries(errors ?? {}).filter(([path]) => path.startsWith(prefix)).map(([path, message]) => [path.slice(prefix.length), message])
    );
  }
  function replaceItem(index, next) {
    const updated = items.slice();
    updated[index] = next;
    onChange(updated);
  }
  function deleteItem(index) {
    onChange(items.filter((_, i) => i !== index));
  }
  function moveItem(from, to) {
    const updated = items.slice();
    const [moved] = updated.splice(from, 1);
    if (moved === void 0) return;
    updated.splice(to, 0, moved);
    onChange(updated);
  }
  return /* @__PURE__ */ jsxs(Stack, { spacing: 1.5, children: [
    !isFixedLength && /* @__PURE__ */ jsxs(
      Stack,
      {
        direction: "row",
        alignItems: "center",
        justifyContent: "space-between",
        children: [
          /* @__PURE__ */ jsx(Typography, { variant: "subtitle1", children: fieldLabel(fieldDef, itemLabel) }),
          /* @__PURE__ */ jsx(
            Button,
            {
              size: "small",
              startIcon: /* @__PURE__ */ jsx(AddIcon, {}),
              disabled: isFull,
              onClick: () => setIsAdding(true),
              children: "Add"
            }
          )
        ]
      }
    ),
    maxItems !== void 0 && !isFixedLength && /* @__PURE__ */ jsxs(Typography, { variant: "body2", color: "text.secondary", children: [
      items.length,
      " of ",
      maxItems,
      " ",
      itemLabel,
      "(s) added. You can add up to",
      " ",
      maxItems,
      " ",
      itemLabel,
      "s."
    ] }),
    headerSlot,
    items.map((item, index) => /* @__PURE__ */ jsx(
      ListItemCard,
      {
        fieldDef,
        item,
        previews,
        icons,
        errors: itemErrors(index),
        onEdit: () => setEditedIndex(index),
        onDragStart: () => setDraggedIndex(index),
        onDragEnd: () => setDraggedIndex(null),
        onDrop: () => {
          if (draggedIndex !== null && draggedIndex !== index) {
            moveItem(draggedIndex, index);
          }
          setDraggedIndex(null);
        }
      },
      index
    )),
    editedIndex !== null && editedItem !== void 0 && /* @__PURE__ */ jsx(
      ListItemDialog,
      {
        title: `Edit ${fieldDef.label ?? itemLabel}`,
        fieldDef,
        item: editedItem,
        renderers,
        errors: itemErrors(editedIndex),
        confirmLabel: "Save",
        onDelete: canDelete ? () => {
          deleteItem(editedIndex);
          setEditedIndex(null);
        } : void 0,
        onConfirm: (next) => {
          replaceItem(editedIndex, next);
          setEditedIndex(null);
        },
        onClose: () => setEditedIndex(null)
      }
    ),
    isAdding && /* @__PURE__ */ jsx(
      ListItemDialog,
      {
        title: `Add ${fieldDef.label ?? itemLabel}`,
        fieldDef,
        item: emptyItem(fieldDef),
        renderers,
        confirmLabel: "Create",
        onConfirm: (next) => {
          onChange([...items, next]);
          setIsAdding(false);
        },
        onClose: () => setIsAdding(false)
      }
    )
  ] });
}
function ListItemCard({
  fieldDef,
  item,
  previews,
  icons,
  errors,
  onEdit,
  onDragStart,
  onDragEnd,
  onDrop
}) {
  const [isDraggable, setIsDraggable] = React.useState(false);
  return /* @__PURE__ */ jsxs(
    Stack,
    {
      direction: "row",
      spacing: 1,
      alignItems: "flex-start",
      draggable: isDraggable,
      onDragStart,
      onDragEnd: () => {
        setIsDraggable(false);
        onDragEnd();
      },
      onDragOver: (event) => event.preventDefault(),
      onDrop,
      sx: { p: 2, borderRadius: 1, bgcolor: "grey.100" },
      children: [
        /* @__PURE__ */ jsx(
          Box,
          {
            onMouseDown: () => setIsDraggable(true),
            onMouseUp: () => setIsDraggable(false),
            sx: { display: "flex", color: "primary.main", cursor: "grab" },
            children: icons?.drag ?? /* @__PURE__ */ jsx(DragIndicatorIcon, { fontSize: "small" })
          }
        ),
        /* @__PURE__ */ jsx(Stack, { spacing: 1.5, sx: { flex: 1, minWidth: 0 }, children: Object.entries(fieldDef.itemFields).map(([subKey, subFieldDef]) => {
          const label = fieldLabel(subFieldDef, subKey);
          if (subFieldDef.kind === "note") {
            return /* @__PURE__ */ jsx(FieldNote, { fieldDef: subFieldDef, label }, subKey);
          }
          const value = typeof item[subKey] === "string" ? item[subKey] : null;
          const preview = previews?.[subFieldDef.kind];
          return /* @__PURE__ */ jsxs(Stack, { spacing: 0.5, children: [
            /* @__PURE__ */ jsx(Typography, { variant: "body2", color: "text.secondary", children: label }),
            preview ? preview(value) : /* @__PURE__ */ jsx(Typography, { variant: "body1", children: fieldSummary(subFieldDef, item[subKey]) }),
            errors?.[subKey] && /* @__PURE__ */ jsx(FieldError, { error: errors[subKey] })
          ] }, subKey);
        }) }),
        /* @__PURE__ */ jsx(
          IconButton,
          {
            size: "small",
            onClick: onEdit,
            "aria-label": "Edit item",
            sx: { color: "primary.main" },
            children: icons?.edit ?? /* @__PURE__ */ jsx(EditOutlinedIcon, { fontSize: "small" })
          }
        )
      ]
    }
  );
}
function ListItemDialog({
  title,
  fieldDef,
  item,
  renderers,
  errors,
  confirmLabel,
  onDelete,
  onConfirm,
  onClose
}) {
  const [draft, setDraft] = React.useState(item);
  return /* @__PURE__ */ jsxs(Dialog, { open: true, fullWidth: true, maxWidth: "xs", onClose, children: [
    /* @__PURE__ */ jsxs(DialogTitle, { sx: { pr: 6 }, children: [
      title,
      /* @__PURE__ */ jsx(
        IconButton,
        {
          size: "small",
          onClick: onClose,
          "aria-label": "Close",
          sx: { position: "absolute", right: 12, top: 12 },
          children: /* @__PURE__ */ jsx(CloseIcon, { fontSize: "small" })
        }
      )
    ] }),
    /* @__PURE__ */ jsx(DialogContent, { dividers: true, children: /* @__PURE__ */ jsxs(Stack, { spacing: 2, sx: { pt: 1 }, children: [
      !!fieldDef.variables?.length && /* @__PURE__ */ jsxs(
        Stack,
        {
          spacing: 1,
          sx: { p: 2, borderRadius: 1, bgcolor: "grey.100" },
          children: [
            /* @__PURE__ */ jsx(Typography, { variant: "subtitle2", children: "Variables to use" }),
            /* @__PURE__ */ jsx(
              Stack,
              {
                direction: "row",
                spacing: 2,
                divider: /* @__PURE__ */ jsx(Divider, { flexItem: true, orientation: "vertical" }),
                children: fieldDef.variables.map((variable) => /* @__PURE__ */ jsxs(Stack, { spacing: 0.5, sx: { flex: 1 }, children: [
                  /* @__PURE__ */ jsx(Typography, { variant: "body2", children: variable.token }),
                  /* @__PURE__ */ jsx(Typography, { variant: "caption", color: "text.secondary", children: variable.description })
                ] }, variable.token))
              }
            )
          ]
        }
      ),
      Object.entries(fieldDef.itemFields).map(([subKey, subFieldDef]) => /* @__PURE__ */ jsx(
        SimpleFieldRenderer,
        {
          fieldKey: subKey,
          fieldDef: subFieldDef,
          value: draft[subKey],
          renderers,
          error: errors?.[subKey],
          onChange: (subValue) => setDraft({ ...draft, [subKey]: subValue })
        },
        subKey
      ))
    ] }) }),
    /* @__PURE__ */ jsx(DialogActions, { sx: { p: 2 }, children: onDelete ? /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(Button, { variant: "outlined", color: "error", onClick: onDelete, children: "Delete" }),
      /* @__PURE__ */ jsx(Button, { variant: "contained", onClick: () => onConfirm(draft), children: confirmLabel })
    ] }) : /* @__PURE__ */ jsx(
      Button,
      {
        fullWidth: true,
        variant: "contained",
        onClick: () => onConfirm(draft),
        children: confirmLabel
      }
    ) })
  ] });
}

// src/components/PageEditor.tsx
import {
  Devices,
  KeyboardArrowDown,
  Visibility,
  VisibilityOff
} from "@mui/icons-material";
import {
  Box as Box2,
  Button as Button2,
  FormControl,
  MenuItem,
  Select,
  Stack as Stack2
} from "@mui/material";
import React2 from "react";
import { jsx as jsx2, jsxs as jsxs2 } from "react/jsx-runtime";
var DEVICE_LABELS = {
  desktop: "Desktop",
  tablet: "Tablet",
  mobile: "Mobile"
};
var PREVIEW_WIDTHS = {
  desktop: 1280,
  tablet: 768,
  mobile: 375
};
var GLOBAL_PREVIEW_PATH = "home";
function PageEditor({
  blockTypes,
  field,
  renderers,
  previews,
  icons,
  errors,
  deviceLabels,
  previewUrl,
  pagePath,
  previewPath,
  previewContent,
  globalPagePaths = [],
  isSaving,
  publishDisabled,
  onPublish
}) {
  const [showPreview, setShowPreview] = React2.useState(true);
  const [previewWidth, setPreviewWidth] = React2.useState("desktop");
  const isGlobal = globalPagePaths.includes(pagePath);
  const routePath = isGlobal ? GLOBAL_PREVIEW_PATH : previewPath ?? pagePath;
  const { iframeRef } = usePreviewSender({
    previewUrl,
    pagePath,
    content: previewContent,
    globals: isGlobal ? { [pagePath]: previewContent } : void 0
  });
  const previewSrc = `${previewUrl}/${routePath === "home" ? "" : routePath}?preview`;
  return /* @__PURE__ */ jsxs2(
    Box2,
    {
      sx: { flex: 1, display: "flex", flexDirection: "column", minHeight: 0 },
      children: [
        /* @__PURE__ */ jsxs2(Stack2, { direction: "row", sx: { flex: 1, overflow: "hidden" }, children: [
          /* @__PURE__ */ jsxs2(
            Box2,
            {
              sx: {
                flex: 1,
                minWidth: 0,
                overflow: "auto",
                p: 3,
                pb: 10,
                bgcolor: "background.level1"
              },
              children: [
                !showPreview && /* @__PURE__ */ jsx2(
                  Button2,
                  {
                    variant: "outlined",
                    size: "small",
                    startIcon: /* @__PURE__ */ jsx2(Visibility, {}),
                    onClick: () => setShowPreview(true),
                    sx: { mb: 2 },
                    children: "Show Preview"
                  }
                ),
                /* @__PURE__ */ jsx2(
                  BlocksField,
                  {
                    blockTypes,
                    field,
                    renderers,
                    previews,
                    icons,
                    errors
                  }
                )
              ]
            }
          ),
          showPreview && /* @__PURE__ */ jsxs2(Stack2, { sx: { flex: 1, minWidth: 0, bgcolor: "grey.200" }, children: [
            /* @__PURE__ */ jsxs2(Stack2, { direction: "row", spacing: 1, sx: { p: 1.5, flexShrink: 0 }, children: [
              /* @__PURE__ */ jsx2(
                Button2,
                {
                  variant: "outlined",
                  size: "small",
                  startIcon: /* @__PURE__ */ jsx2(VisibilityOff, {}),
                  onClick: () => setShowPreview(false),
                  sx: { whiteSpace: "nowrap", bgcolor: "background.paper" },
                  children: "Hide Preview"
                }
              ),
              /* @__PURE__ */ jsx2(FormControl, { size: "small", children: /* @__PURE__ */ jsx2(
                Select,
                {
                  value: previewWidth,
                  onChange: (event) => setPreviewWidth(event.target.value),
                  startAdornment: /* @__PURE__ */ jsx2(
                    Devices,
                    {
                      sx: { fontSize: 18, color: "text.secondary", mr: 1 }
                    }
                  ),
                  IconComponent: KeyboardArrowDown,
                  sx: { bgcolor: "background.paper" },
                  children: Object.keys(DEVICE_LABELS).map(
                    (device) => /* @__PURE__ */ jsx2(MenuItem, { value: device, children: deviceLabels?.[device] ?? DEVICE_LABELS[device] }, device)
                  )
                }
              ) })
            ] }),
            /* @__PURE__ */ jsx2(
              PreviewIframe,
              {
                iframeRef,
                src: previewSrc,
                renderWidth: PREVIEW_WIDTHS[previewWidth]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsx2(
          Stack2,
          {
            direction: "row",
            alignItems: "center",
            justifyContent: "flex-end",
            sx: {
              px: 2,
              py: 1.5,
              flexShrink: 0,
              borderTop: "1px solid",
              borderColor: "divider",
              bgcolor: "background.paper"
            },
            children: /* @__PURE__ */ jsx2(
              Button2,
              {
                variant: "contained",
                onClick: onPublish,
                disabled: isSaving || publishDisabled,
                children: "Publish Changes"
              }
            )
          }
        )
      ]
    }
  );
}
function PreviewIframe({
  iframeRef,
  src,
  renderWidth
}) {
  const containerRef = React2.useRef(null);
  const [containerWidth, setContainerWidth] = React2.useState(0);
  React2.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      setContainerWidth(entry.contentRect.width);
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);
  if (!src) return null;
  const scale = containerWidth > 0 ? Math.min(1, containerWidth / renderWidth) : 0.5;
  return /* @__PURE__ */ jsx2(Box2, { ref: containerRef, sx: { flex: 1, overflow: "hidden", p: 1.5, pt: 0 }, children: /* @__PURE__ */ jsx2(
    Box2,
    {
      sx: {
        width: "100%",
        maxWidth: renderWidth,
        height: "100%",
        overflow: "hidden",
        mx: "auto"
      },
      children: /* @__PURE__ */ jsx2(
        "iframe",
        {
          ref: iframeRef,
          src,
          title: "Page preview",
          style: {
            width: renderWidth,
            height: `${Math.round(100 / scale)}%`,
            border: "none",
            backgroundColor: "white",
            transformOrigin: "top left",
            transform: `scale(${scale})`,
            display: "block",
            borderRadius: 8
          }
        }
      )
    }
  ) });
}

// src/components/PublishState.tsx
import { Chip } from "@mui/material";
import { format, isBefore, parseISO } from "date-fns";
import { jsx as jsx3 } from "react/jsx-runtime";
function PublishState({
  item
}) {
  const dateFormat = "dd MMM yyyy, HH:mm";
  if (item.publishAt) {
    const publishDate = parseISO(item.publishAt);
    if (isBefore(/* @__PURE__ */ new Date(), publishDate)) {
      return /* @__PURE__ */ jsx3(
        Chip,
        {
          label: format(parseISO(item.publishAt), dateFormat),
          color: "info"
        }
      );
    }
    return /* @__PURE__ */ jsx3(
      Chip,
      {
        label: format(parseISO(item.publishAt), dateFormat),
        color: "success"
      }
    );
  }
  return /* @__PURE__ */ jsx3(Chip, { label: "Draft", color: "warning" });
}

// src/components/SeoEditor.tsx
import { Box as Box3, Button as Button3, Chip as Chip2, Stack as Stack3, Typography as Typography2 } from "@mui/material";
import { FieldText as FieldText2 } from "@m10c/mui-kit";
import { Fragment as Fragment2, jsx as jsx4, jsxs as jsxs3 } from "react/jsx-runtime";
var FAVICON_CHIP_SIZE = 26;
var FAVICON_SIZE = 20;
function CharacterCount({
  value,
  min,
  max
}) {
  const count = value?.length ?? 0;
  const isGood = count >= min && count <= max;
  const isTooLong = count > max;
  return /* @__PURE__ */ jsxs3(Stack3, { direction: "row", spacing: 1, alignItems: "center", children: [
    /* @__PURE__ */ jsx4(
      Chip2,
      {
        size: "small",
        label: isTooLong ? "Too long" : isGood ? "Good" : "Too short",
        color: isTooLong ? "error" : isGood ? "success" : "warning"
      }
    ),
    /* @__PURE__ */ jsxs3(Typography2, { variant: "caption", color: "text.secondary", children: [
      "Character count: ",
      count,
      " (",
      min,
      "-",
      max,
      " recommended)"
    ] })
  ] });
}
function SeoEditor({
  pageTitleField,
  descriptionField,
  renderers,
  imageField,
  renderImageField,
  imagePreviewUrl,
  fallbackImageUrl,
  faviconUrl,
  fallbackTitle,
  siteName = "",
  isSaving,
  publishDisabled,
  onPublish
}) {
  const pageTitle = pageTitleField.value ?? "";
  const description = descriptionField.value ?? "";
  const socialImageUrl = imagePreviewUrl ?? fallbackImageUrl;
  return /* @__PURE__ */ jsxs3(
    Box3,
    {
      sx: { flex: 1, display: "flex", flexDirection: "column", minHeight: 0 },
      children: [
        /* @__PURE__ */ jsx4(
          Box3,
          {
            sx: {
              flex: 1,
              overflow: "auto",
              p: 4,
              pb: 10,
              bgcolor: "background.level1"
            },
            children: /* @__PURE__ */ jsxs3(Stack3, { direction: "row", sx: { gap: "56px", justifyContent: "center" }, children: [
              /* @__PURE__ */ jsxs3(Stack3, { sx: { width: 571 }, spacing: 3, children: [
                /* @__PURE__ */ jsxs3(Stack3, { spacing: 1, children: [
                  renderers?.text ? renderers.text({
                    name: "pageTitle",
                    label: "Page Title",
                    value: pageTitleField.value ?? null,
                    onChange: pageTitleField.handleValueChange
                  }) : /* @__PURE__ */ jsxs3(Fragment2, { children: [
                    /* @__PURE__ */ jsx4(Typography2, { variant: "subtitle2", children: "Page Title" }),
                    /* @__PURE__ */ jsx4(
                      FieldText2,
                      {
                        field: pageTitleField,
                        hiddenLabel: true,
                        size: "small",
                        fullWidth: true
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsx4(CharacterCount, { value: pageTitle, min: 45, max: 60 })
                ] }),
                /* @__PURE__ */ jsxs3(Stack3, { spacing: 1, children: [
                  renderers?.textarea ? renderers.textarea({
                    name: "description",
                    label: "Description",
                    value: descriptionField.value ?? null,
                    onChange: descriptionField.handleValueChange
                  }) : /* @__PURE__ */ jsxs3(Fragment2, { children: [
                    /* @__PURE__ */ jsx4(Typography2, { variant: "subtitle2", children: "Description" }),
                    /* @__PURE__ */ jsx4(
                      FieldText2,
                      {
                        field: descriptionField,
                        hiddenLabel: true,
                        size: "small",
                        fullWidth: true,
                        multiline: true,
                        rows: 4
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsx4(CharacterCount, { value: description, min: 100, max: 150 })
                ] }),
                imageField && renderImageField && renderImageField(imageField)
              ] }),
              /* @__PURE__ */ jsxs3(Stack3, { sx: { width: 555 }, spacing: 3, children: [
                /* @__PURE__ */ jsxs3(Stack3, { spacing: 1, children: [
                  /* @__PURE__ */ jsx4(Typography2, { variant: "subtitle2", children: "Search Preview" }),
                  /* @__PURE__ */ jsx4(
                    Box3,
                    {
                      sx: {
                        bgcolor: "white",
                        borderRadius: "20px",
                        p: 2,
                        boxShadow: "0px 0px 0px 1px rgba(0,0,0,0.06), 0px 5px 22px 0px rgba(0,0,0,0.04)"
                      },
                      children: /* @__PURE__ */ jsxs3(Stack3, { spacing: 1.5, children: [
                        /* @__PURE__ */ jsxs3(Stack3, { direction: "row", spacing: 1, alignItems: "center", children: [
                          /* @__PURE__ */ jsx4(
                            Box3,
                            {
                              sx: {
                                width: FAVICON_CHIP_SIZE,
                                height: FAVICON_CHIP_SIZE,
                                borderRadius: "50%",
                                bgcolor: "grey.200",
                                flexShrink: 0,
                                backgroundImage: faviconUrl ? `url(${faviconUrl})` : void 0,
                                backgroundSize: FAVICON_SIZE,
                                backgroundRepeat: "no-repeat",
                                backgroundPosition: "center"
                              }
                            }
                          ),
                          /* @__PURE__ */ jsxs3(Stack3, { children: [
                            /* @__PURE__ */ jsx4(
                              Typography2,
                              {
                                sx: {
                                  fontFamily: "Arial, sans-serif",
                                  fontSize: 15,
                                  color: "#333",
                                  lineHeight: 1.2
                                },
                                children: fallbackTitle
                              }
                            ),
                            /* @__PURE__ */ jsx4(
                              Typography2,
                              {
                                sx: {
                                  fontFamily: "Arial, sans-serif",
                                  fontSize: 12,
                                  color: "#828282",
                                  lineHeight: 1.2
                                },
                                children: siteName
                              }
                            )
                          ] })
                        ] }),
                        /* @__PURE__ */ jsx4(
                          Typography2,
                          {
                            sx: {
                              fontFamily: "Arial, sans-serif",
                              fontSize: 22,
                              color: "#1718A4",
                              lineHeight: "22px"
                            },
                            children: pageTitle || fallbackTitle
                          }
                        ),
                        /* @__PURE__ */ jsx4(
                          Typography2,
                          {
                            sx: {
                              fontFamily: "Arial, sans-serif",
                              fontSize: 14,
                              color: "#333",
                              lineHeight: "22px"
                            },
                            children: description || "No description set"
                          }
                        )
                      ] })
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs3(Stack3, { spacing: 1, children: [
                  /* @__PURE__ */ jsx4(Typography2, { variant: "subtitle2", children: "Social Media Preview" }),
                  /* @__PURE__ */ jsxs3(
                    Box3,
                    {
                      sx: {
                        bgcolor: "white",
                        borderRadius: "20px",
                        overflow: "hidden",
                        boxShadow: "0px 0px 0px 1px rgba(0,0,0,0.06), 0px 5px 22px 0px rgba(0,0,0,0.04)"
                      },
                      children: [
                        /* @__PURE__ */ jsx4(
                          Box3,
                          {
                            sx: {
                              height: 260,
                              bgcolor: "grey.300",
                              backgroundImage: socialImageUrl ? `url(${socialImageUrl})` : void 0,
                              backgroundSize: "cover",
                              backgroundPosition: "center"
                            }
                          }
                        ),
                        /* @__PURE__ */ jsxs3(
                          Stack3,
                          {
                            sx: { bgcolor: "grey.100", px: 2, py: 1.5 },
                            spacing: 0.5,
                            children: [
                              /* @__PURE__ */ jsx4(
                                Typography2,
                                {
                                  sx: {
                                    fontSize: 12,
                                    color: "#65676B",
                                    textTransform: "uppercase",
                                    lineHeight: "15px"
                                  },
                                  children: siteName
                                }
                              ),
                              /* @__PURE__ */ jsx4(
                                Typography2,
                                {
                                  sx: {
                                    fontSize: 16,
                                    fontWeight: 510,
                                    color: "#0F1419",
                                    lineHeight: "19px"
                                  },
                                  children: pageTitle || fallbackTitle
                                }
                              ),
                              /* @__PURE__ */ jsx4(
                                Typography2,
                                {
                                  sx: {
                                    fontSize: 14,
                                    color: "#65676B",
                                    lineHeight: "19px",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap"
                                  },
                                  children: description || "No description set"
                                }
                              )
                            ]
                          }
                        )
                      ]
                    }
                  )
                ] })
              ] })
            ] })
          }
        ),
        /* @__PURE__ */ jsx4(
          Stack3,
          {
            direction: "row",
            alignItems: "center",
            justifyContent: "flex-end",
            sx: {
              px: 3,
              py: 2,
              flexShrink: 0,
              borderTop: "1px solid",
              borderColor: "divider",
              bgcolor: "background.paper"
            },
            children: /* @__PURE__ */ jsx4(Button3, { variant: "contained", onClick: onPublish, disabled: isSaving || publishDisabled, children: "Publish Changes" })
          }
        )
      ]
    }
  );
}
export {
  BlocksField,
  PageEditor,
  PublishState,
  SeoEditor,
  usePreviewSender,
  useWebsiteGlobalData,
  useWebsitePageData
};
//# sourceMappingURL=index.js.map