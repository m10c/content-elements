import {
  preview_device_widths_default,
  preview_message_default,
  usePreviewSender,
  useWebsiteGlobalData,
  useWebsitePageData
} from "./chunk-ZGUSUBFS.js";

// src/components/AddBlockDialog.tsx
import CloseIcon from "@mui/icons-material/Close";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack
} from "@mui/material";
import { jsx, jsxs } from "react/jsx-runtime";
function AddBlockDialog({
  open,
  onClose,
  blockTypes,
  onSelect,
  icons,
  title = "Add block"
}) {
  return /* @__PURE__ */ jsxs(Dialog, { open, onClose, maxWidth: "xs", fullWidth: true, children: [
    /* @__PURE__ */ jsx(DialogTitle, { children: /* @__PURE__ */ jsxs(
      Stack,
      {
        direction: "row",
        alignItems: "center",
        justifyContent: "space-between",
        children: [
          title,
          /* @__PURE__ */ jsx(IconButton, { onClick: onClose, size: "small", "aria-label": "Close", children: /* @__PURE__ */ jsx(CloseIcon, {}) })
        ]
      }
    ) }),
    /* @__PURE__ */ jsx(DialogContent, { sx: { px: 1, pb: 2 }, children: /* @__PURE__ */ jsx(List, { disablePadding: true, children: blockTypes.map((blockType) => /* @__PURE__ */ jsxs(
      ListItemButton,
      {
        onClick: () => {
          onSelect(blockType);
          onClose();
        },
        children: [
          icons?.[blockType.key] && /* @__PURE__ */ jsx(ListItemIcon, { children: icons[blockType.key] }),
          /* @__PURE__ */ jsx(ListItemText, { primary: blockType.label })
        ]
      },
      blockType.key
    )) }) })
  ] });
}

// src/components/BlockCardFrame.tsx
import { Box, Card, Stack as Stack2, Typography } from "@mui/material";
import { jsx as jsx2, jsxs as jsxs2 } from "react/jsx-runtime";
function BlockCardFrame({
  gutter,
  title,
  action,
  children,
  sx,
  ...cardProps
}) {
  return /* @__PURE__ */ jsxs2(
    Card,
    {
      ...cardProps,
      sx: [
        { display: "flex", gap: 1, pt: 2, pb: 3, pl: gutter ? 0 : 3 },
        ...Array.isArray(sx) ? sx : [sx]
      ],
      children: [
        gutter && /* @__PURE__ */ jsx2(Box, { sx: { display: "flex", p: 1, color: "text.secondary" }, children: gutter }),
        /* @__PURE__ */ jsxs2(Stack2, { spacing: 2, sx: { flex: 1, minWidth: 0, pr: 2 }, children: [
          (title || action) && /* @__PURE__ */ jsxs2(
            Stack2,
            {
              direction: "row",
              alignItems: "center",
              justifyContent: "space-between",
              spacing: 1,
              sx: { minHeight: 40 },
              children: [
                /* @__PURE__ */ jsx2(Typography, { variant: "h6", children: title }),
                action
              ]
            }
          ),
          children
        ] })
      ]
    }
  );
}

// src/components/BlocksField.tsx
import AddIcon from "@mui/icons-material/Add";
import CloseIcon2 from "@mui/icons-material/Close";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import {
  Box as Box2,
  Button as Button2,
  Card as Card2,
  CardContent,
  Dialog as Dialog3,
  DialogActions as DialogActions2,
  DialogContent as DialogContent3,
  DialogTitle as DialogTitle3,
  Divider as Divider2,
  IconButton as IconButton2,
  InputAdornment,
  Stack as Stack4,
  Typography as Typography3
} from "@mui/material";
import { FieldRadioGroup, FieldSwitch, FieldText } from "@m10c/mui-kit";
import React3 from "react";

// src/hooks/use-drag-reorder.ts
import React from "react";
function useDragReorder(onMove) {
  const [draggedIndex, setDraggedIndex] = React.useState(null);
  return (index) => ({
    onDragStart: (event) => {
      if (event.target !== event.currentTarget) return;
      setDraggedIndex(index);
    },
    onDragEnd: () => setDraggedIndex(null),
    onDragOver: (event) => event.preventDefault(),
    onDrop: () => {
      if (draggedIndex !== null && draggedIndex !== index) {
        onMove(draggedIndex, index);
      }
      setDraggedIndex(null);
    }
  });
}

// src/hooks/use-draggable-by-handle.ts
import React2 from "react";
function useDraggableByHandle() {
  const [isDraggable, setIsDraggable] = React2.useState(false);
  return {
    isDraggable,
    stopDragging: () => setIsDraggable(false),
    handleProps: {
      onMouseDown: () => setIsDraggable(true),
      onMouseUp: () => setIsDraggable(false)
    }
  };
}

// src/utils/empty-field-value.ts
function emptyFieldValue(fieldDef) {
  if (fieldDef.kind === "list") return [];
  if (fieldDef.kind === "boolean") return false;
  return "";
}

// src/utils/move-item.ts
function moveItem(items, from, to) {
  const updated = items.slice();
  const [moved] = updated.splice(from, 1);
  if (moved === void 0) return updated;
  updated.splice(to, 0, moved);
  return updated;
}

// src/components/ConfirmDialog.tsx
import WarningIcon from "@mui/icons-material/WarningAmber";
import {
  Button,
  Dialog as Dialog2,
  DialogActions,
  DialogContent as DialogContent2,
  DialogTitle as DialogTitle2,
  Divider,
  Stack as Stack3,
  SvgIcon,
  Typography as Typography2
} from "@mui/material";
import { jsx as jsx3, jsxs as jsxs3 } from "react/jsx-runtime";
function ConfirmDialog({
  open,
  title,
  description,
  subtitle,
  warning,
  confirmText = "Confirm",
  confirmColor = "error",
  isLoading = false,
  onClose,
  onConfirm
}) {
  return /* @__PURE__ */ jsxs3(
    Dialog2,
    {
      open,
      onClose: isLoading ? void 0 : onClose,
      maxWidth: "xs",
      fullWidth: true,
      children: [
        /* @__PURE__ */ jsxs3(DialogTitle2, { component: "div", children: [
          /* @__PURE__ */ jsx3(Typography2, { variant: "h6", children: title }),
          subtitle && /* @__PURE__ */ jsx3(Typography2, { variant: "body2", color: "text.secondary", component: "div", children: subtitle })
        ] }),
        /* @__PURE__ */ jsx3(Divider, {}),
        /* @__PURE__ */ jsx3(DialogContent2, { children: /* @__PURE__ */ jsxs3(Stack3, { spacing: 1, children: [
          /* @__PURE__ */ jsx3(Typography2, { variant: "body2", color: "text.secondary", component: "div", children: description }),
          warning && /* @__PURE__ */ jsxs3(
            Typography2,
            {
              variant: "body2",
              color: "warning.main",
              component: "div",
              sx: { display: "flex", gap: 0.5 },
              children: [
                /* @__PURE__ */ jsx3(SvgIcon, { sx: { fontSize: 18, mt: 0.25 }, children: /* @__PURE__ */ jsx3(WarningIcon, {}) }),
                warning
              ]
            }
          )
        ] }) }),
        /* @__PURE__ */ jsx3(Divider, {}),
        /* @__PURE__ */ jsxs3(DialogActions, { sx: { justifyContent: "flex-start", p: 2 }, children: [
          /* @__PURE__ */ jsx3(
            Button,
            {
              onClick: onConfirm,
              variant: "contained",
              color: confirmColor,
              disabled: isLoading,
              children: confirmText
            }
          ),
          /* @__PURE__ */ jsx3(
            Button,
            {
              onClick: onClose,
              variant: "outlined",
              color: "inherit",
              disabled: isLoading,
              children: "Cancel"
            }
          )
        ] })
      ]
    }
  );
}

// src/components/BlocksField.tsx
import { Fragment, jsx as jsx4, jsxs as jsxs4 } from "react/jsx-runtime";
function BlocksField({
  blockTypes,
  field,
  renderers,
  previews,
  icons,
  errors,
  blockComponents,
  canEditBlockList = false,
  header,
  footer,
  emptyState
}, ref) {
  const blocks = field.value ?? [];
  const [pendingDeleteIndex, setPendingDeleteIndex] = React3.useState(null);
  const [pendingScrollIndex, setPendingScrollIndex] = React3.useState(null);
  const blockElementsRef = React3.useRef(/* @__PURE__ */ new Map());
  React3.useImperativeHandle(
    ref,
    () => ({ scrollToBlock: (index) => setPendingScrollIndex(index) }),
    []
  );
  const nextKeyRef = React3.useRef(0);
  const keysRef = React3.useRef([]);
  if (keysRef.current.length !== blocks.length) {
    keysRef.current = blocks.map(
      (_, index) => keysRef.current[index] ?? `block-${nextKeyRef.current++}`
    );
  }
  const blockTypesByKey = React3.useMemo(
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
  function deleteBlock(index) {
    keysRef.current = keysRef.current.filter((_, i) => i !== index);
    field.handleValueChange(blocks.filter((_, i) => i !== index));
  }
  const getDragProps = useDragReorder((from, to) => {
    keysRef.current = moveItem(keysRef.current, from, to);
    field.handleValueChange(moveItem(blocks, from, to));
  });
  React3.useEffect(() => {
    if (pendingScrollIndex === null) return;
    setPendingScrollIndex(null);
    const key = keysRef.current[pendingScrollIndex];
    if (key === void 0) return;
    blockElementsRef.current.get(key)?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [pendingScrollIndex]);
  return /* @__PURE__ */ jsxs4(Fragment, { children: [
    /* @__PURE__ */ jsxs4(Stack4, { spacing: canEditBlockList ? 3 : 2, children: [
      header,
      blocks.length === 0 && emptyState,
      blocks.map((block, index) => {
        const key = keysRef.current[index];
        if (key === void 0) {
          throw new Error(`Block ${index} has no key`);
        }
        return /* @__PURE__ */ jsx4(
          "div",
          {
            ref: (element) => {
              if (element) blockElementsRef.current.set(key, element);
              else blockElementsRef.current.delete(key);
            },
            children: /* @__PURE__ */ jsx4(
              BlockCard,
              {
                block,
                blockType: blockTypesByKey[block.type],
                component: blockComponents?.[block.type],
                renderers,
                previews,
                icons,
                errors,
                errorPath: String(index),
                dragProps: canEditBlockList ? getDragProps(index) : void 0,
                onChange: (next) => updateBlock(index, next),
                onDelete: canEditBlockList ? () => setPendingDeleteIndex(index) : void 0
              }
            )
          },
          key
        );
      }),
      footer
    ] }),
    /* @__PURE__ */ jsx4(
      ConfirmDialog,
      {
        open: pendingDeleteIndex !== null,
        title: "Delete block",
        description: "Are you sure you want to delete this block?",
        confirmText: "Delete",
        onClose: () => setPendingDeleteIndex(null),
        onConfirm: () => {
          if (pendingDeleteIndex !== null) deleteBlock(pendingDeleteIndex);
          setPendingDeleteIndex(null);
        }
      }
    )
  ] });
}
var BlocksField_default = React3.forwardRef(BlocksField);
function BlockCard({
  block,
  blockType,
  component: BlockComponent,
  renderers,
  previews,
  icons,
  errors,
  errorPath,
  dragProps,
  onChange,
  onDelete
}) {
  const { isDraggable, stopDragging, handleProps } = useDraggableByHandle();
  const [headerActionContainer, setHeaderActionContainer] = React3.useState(null);
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
    return /* @__PURE__ */ jsx4(Fragment, { children: Object.entries(fields).filter(([key]) => claimed.includes(key)).map(
      ([key, headerFieldDef]) => headerFieldDef.kind === "list" ? null : /* @__PURE__ */ jsx4(
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
  const showLabel = !blockType?.hideLabel;
  const label = blockType?.label ?? `Unknown block: ${block.type}`;
  const body = BlockComponent ? /* @__PURE__ */ jsx4(
    BlockComponent,
    {
      block,
      onChange: (data) => onChange({ ...block, data }),
      errors,
      errorPath,
      headerActionContainer
    }
  ) : blockType ? Object.entries(blockType.fields).filter(([key]) => !headerFieldKeys.has(key)).map(([key, fieldDef]) => /* @__PURE__ */ jsx4(
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
  )) : /* @__PURE__ */ jsxs4(Typography3, { variant: "body2", color: "text.secondary", children: [
    'No schema registered for block type "',
    block.type,
    '".'
  ] });
  if (dragProps || onDelete) {
    return /* @__PURE__ */ jsx4(
      BlockCardFrame,
      {
        draggable: isDraggable,
        onDragStart: dragProps?.onDragStart,
        onDragEnd: () => {
          stopDragging();
          dragProps?.onDragEnd();
        },
        onDragOver: dragProps?.onDragOver,
        onDrop: dragProps?.onDrop,
        gutter: dragProps && /* @__PURE__ */ jsx4(
          Box2,
          {
            ...handleProps,
            sx: { display: "flex", color: "primary.main", cursor: "grab" },
            children: icons?.drag ?? /* @__PURE__ */ jsx4(DragIndicatorIcon, {})
          }
        ),
        title: showLabel ? label : void 0,
        action: /* @__PURE__ */ jsxs4(Stack4, { direction: "row", alignItems: "center", spacing: 1, children: [
          /* @__PURE__ */ jsx4(Box2, { ref: setHeaderActionContainer, sx: { display: "flex" } }),
          onDelete && /* @__PURE__ */ jsx4(
            IconButton2,
            {
              size: "small",
              onClick: onDelete,
              "aria-label": "Delete block",
              children: icons?.delete ?? /* @__PURE__ */ jsx4(DeleteOutlineIcon, {})
            }
          )
        ] }),
        children: body
      }
    );
  }
  return /* @__PURE__ */ jsx4(Card2, { children: /* @__PURE__ */ jsx4(CardContent, { sx: { p: 2.5, "&:last-child": { pb: 2.5 } }, children: /* @__PURE__ */ jsxs4(Stack4, { spacing: 2, children: [
    showLabel && /* @__PURE__ */ jsx4(Typography3, { variant: "subtitle1", children: label }),
    body
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
    return /* @__PURE__ */ jsx4(
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
  return /* @__PURE__ */ jsx4(
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
    return /* @__PURE__ */ jsx4(FieldNote, { fieldDef, label });
  }
  const stringValue = typeof value === "string" ? value : null;
  const isOn = value === true;
  const customRenderer = renderers?.[fieldDef.kind];
  if (customRenderer) {
    return /* @__PURE__ */ jsx4(Fragment, { children: customRenderer({
      name: fieldKey,
      label,
      value: stringValue,
      features: fieldDef.features,
      hint: fieldHint(fieldDef),
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
  if (fieldDef.kind === "boolean") {
    return /* @__PURE__ */ jsx4(FieldWrap, { fieldDef, error, children: /* @__PURE__ */ jsx4(
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
  if (fieldDef.kind === "select") {
    return /* @__PURE__ */ jsx4(FieldWrap, { fieldDef, label, error, children: /* @__PURE__ */ jsx4(
      FieldRadioGroup,
      {
        field: {
          name: fieldKey,
          label,
          value: stringValue ?? "",
          handleValueChange: onChange
        },
        options: (fieldDef.options ?? []).map((option) => ({
          value: option,
          label: option
        }))
      }
    ) });
  }
  if (fieldDef.kind === "images") {
    return /* @__PURE__ */ jsx4(FieldWrap, { fieldDef, label, error });
  }
  const fieldProp = {
    name: fieldKey,
    label,
    value: stringValue,
    handleValueChange: onChange,
    errorList: error === void 0 ? void 0 : [error]
  };
  const multiline = fieldDef.kind === "textarea" || fieldDef.kind === "markdown" || fieldDef.kind === "richtext";
  return /* @__PURE__ */ jsx4(FieldWrap, { fieldDef, label, children: /* @__PURE__ */ jsx4(
    FieldText,
    {
      field: fieldProp,
      hiddenLabel: true,
      multiline,
      minRows: multiline ? 2 : void 0,
      InputProps: fieldDef.prefix ? {
        startAdornment: /* @__PURE__ */ jsx4(InputAdornment, { position: "start", children: fieldDef.prefix })
      } : void 0,
      inputProps: fieldDef.maxLength ? { maxLength: fieldDef.maxLength } : void 0
    }
  ) });
}
function FieldWrap({ fieldDef, label, error, children }) {
  return /* @__PURE__ */ jsxs4(Stack4, { spacing: 1, children: [
    /* @__PURE__ */ jsxs4(Stack4, { spacing: 0.5, children: [
      label && /* @__PURE__ */ jsx4(Typography3, { variant: "subtitle2", children: label }),
      fieldHint(fieldDef) && /* @__PURE__ */ jsx4(Typography3, { variant: "body2", color: "text.secondary", children: fieldHint(fieldDef) })
    ] }),
    children,
    error && /* @__PURE__ */ jsx4(FieldError, { error })
  ] });
}
function FieldError({ error }) {
  return /* @__PURE__ */ jsx4(Typography3, { variant: "caption", color: "error.main", children: error });
}
function FieldNote({
  fieldDef,
  label
}) {
  return /* @__PURE__ */ jsxs4(Stack4, { spacing: 0.5, children: [
    fieldDef.label && /* @__PURE__ */ jsx4(Typography3, { variant: "subtitle1", children: label }),
    /* @__PURE__ */ jsx4(Typography3, { variant: "body2", color: "text.secondary", children: fieldDef.text })
  ] });
}
function stringValues(value) {
  return Array.isArray(value) ? value.filter((item) => typeof item === "string") : [];
}
function fieldLabel(fieldDef, fallback) {
  return `${fieldDef.label ?? fallback}${fieldDef.required ? "*" : ""}`;
}
function fieldHint(fieldDef) {
  if (fieldDef.hint) return fieldDef.hint;
  return fieldDef.dimensions ? `Recommended size ${fieldDef.dimensions}px` : void 0;
}
function fieldSummary(fieldDef, value) {
  if (fieldDef.kind === "boolean") return value === true ? "Yes" : "No";
  if (typeof value !== "string") return null;
  return fieldDef.kind === "richtext" || fieldDef.kind === "markdown" ? plainText(value) : value;
}
function plainText(html) {
  return html.replace(/<br\s*\/?>/gi, " ").replace(/<\/(p|div|li|h[1-6])>/gi, " ").replace(/<[^>]*>/g, "").replace(/&nbsp;/gi, " ").replace(/&amp;/gi, "&").replace(/&lt;/gi, "<").replace(/&gt;/gi, ">").replace(/&quot;/gi, '"').replace(/&#39;/gi, "'").replace(/\s+/g, " ").trim();
}
function emptyItem(fieldDef) {
  return Object.fromEntries(
    Object.entries(fieldDef.itemFields).map(([key, subFieldDef]) => [
      key,
      emptyFieldValue(subFieldDef)
    ])
  );
}
function ListFieldRenderer(props) {
  return props.fieldDef.variant === "inline" ? /* @__PURE__ */ jsx4(ListInline, { ...props }) : /* @__PURE__ */ jsx4(ListCards, { ...props });
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
  return /* @__PURE__ */ jsx4(Stack4, { spacing: 2, children: items.map((item, index) => /* @__PURE__ */ jsxs4(React3.Fragment, { children: [
    index > 0 && /* @__PURE__ */ jsx4(Divider2, {}),
    Object.entries(fieldDef.itemFields).map(([subKey, subFieldDef]) => /* @__PURE__ */ jsx4(
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
  const [editedIndex, setEditedIndex] = React3.useState(null);
  const [isAdding, setIsAdding] = React3.useState(false);
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
  const getDragProps = useDragReorder(
    (from, to) => onChange(moveItem(items, from, to))
  );
  return /* @__PURE__ */ jsxs4(Stack4, { spacing: 1.5, children: [
    !isFixedLength && /* @__PURE__ */ jsxs4(
      Stack4,
      {
        direction: "row",
        alignItems: "center",
        justifyContent: "space-between",
        children: [
          /* @__PURE__ */ jsx4(Typography3, { variant: "subtitle1", children: fieldLabel(fieldDef, itemLabel) }),
          /* @__PURE__ */ jsx4(
            Button2,
            {
              size: "small",
              startIcon: /* @__PURE__ */ jsx4(AddIcon, {}),
              disabled: isFull,
              onClick: () => setIsAdding(true),
              children: "Add"
            }
          )
        ]
      }
    ),
    maxItems !== void 0 && !isFixedLength && /* @__PURE__ */ jsxs4(Typography3, { variant: "body2", color: "text.secondary", children: [
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
    items.map((item, index) => /* @__PURE__ */ jsx4(
      ListItemCard,
      {
        fieldDef,
        item,
        previews,
        icons,
        errors: itemErrors(index),
        onEdit: () => setEditedIndex(index),
        dragProps: getDragProps(index)
      },
      index
    )),
    editedIndex !== null && editedItem !== void 0 && /* @__PURE__ */ jsx4(
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
    isAdding && /* @__PURE__ */ jsx4(
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
  dragProps
}) {
  const { isDraggable, stopDragging, handleProps } = useDraggableByHandle();
  return /* @__PURE__ */ jsxs4(
    Stack4,
    {
      direction: "row",
      spacing: 1,
      alignItems: "flex-start",
      draggable: isDraggable,
      onDragStart: dragProps.onDragStart,
      onDragEnd: () => {
        stopDragging();
        dragProps.onDragEnd();
      },
      onDragOver: dragProps.onDragOver,
      onDrop: dragProps.onDrop,
      sx: { p: 2, borderRadius: 1, bgcolor: "grey.100" },
      children: [
        /* @__PURE__ */ jsx4(
          Box2,
          {
            ...handleProps,
            sx: { display: "flex", color: "primary.main", cursor: "grab" },
            children: icons?.drag ?? /* @__PURE__ */ jsx4(DragIndicatorIcon, { fontSize: "small" })
          }
        ),
        /* @__PURE__ */ jsx4(Stack4, { spacing: 1.5, sx: { flex: 1, minWidth: 0 }, children: Object.entries(fieldDef.itemFields).map(([subKey, subFieldDef]) => {
          const label = fieldLabel(subFieldDef, subKey);
          if (subFieldDef.kind === "note") {
            return /* @__PURE__ */ jsx4(FieldNote, { fieldDef: subFieldDef, label }, subKey);
          }
          const value = typeof item[subKey] === "string" ? item[subKey] : null;
          const preview = previews?.[subFieldDef.kind];
          return /* @__PURE__ */ jsxs4(Stack4, { spacing: 0.5, children: [
            /* @__PURE__ */ jsx4(Typography3, { variant: "body2", color: "text.secondary", children: label }),
            preview ? preview(value) : /* @__PURE__ */ jsx4(Typography3, { variant: "body1", children: fieldSummary(subFieldDef, item[subKey]) }),
            errors?.[subKey] && /* @__PURE__ */ jsx4(FieldError, { error: errors[subKey] })
          ] }, subKey);
        }) }),
        /* @__PURE__ */ jsx4(
          IconButton2,
          {
            size: "small",
            onClick: onEdit,
            "aria-label": "Edit item",
            sx: { color: "primary.main" },
            children: icons?.edit ?? /* @__PURE__ */ jsx4(EditOutlinedIcon, { fontSize: "small" })
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
  const [draft, setDraft] = React3.useState(item);
  return /* @__PURE__ */ jsxs4(Dialog3, { open: true, fullWidth: true, maxWidth: "xs", onClose, children: [
    /* @__PURE__ */ jsxs4(DialogTitle3, { sx: { pr: 6 }, children: [
      title,
      /* @__PURE__ */ jsx4(
        IconButton2,
        {
          size: "small",
          onClick: onClose,
          "aria-label": "Close",
          sx: { position: "absolute", right: 12, top: 12 },
          children: /* @__PURE__ */ jsx4(CloseIcon2, { fontSize: "small" })
        }
      )
    ] }),
    /* @__PURE__ */ jsx4(DialogContent3, { dividers: true, children: /* @__PURE__ */ jsxs4(Stack4, { spacing: 2, sx: { pt: 1 }, children: [
      !!fieldDef.variables?.length && /* @__PURE__ */ jsxs4(
        Stack4,
        {
          spacing: 1,
          sx: { p: 2, borderRadius: 1, bgcolor: "grey.100" },
          children: [
            /* @__PURE__ */ jsx4(Typography3, { variant: "subtitle2", children: "Variables to use" }),
            /* @__PURE__ */ jsx4(
              Stack4,
              {
                direction: "row",
                spacing: 2,
                divider: /* @__PURE__ */ jsx4(Divider2, { flexItem: true, orientation: "vertical" }),
                children: fieldDef.variables.map((variable) => /* @__PURE__ */ jsxs4(Stack4, { spacing: 0.5, sx: { flex: 1 }, children: [
                  /* @__PURE__ */ jsx4(Typography3, { variant: "body2", children: variable.token }),
                  /* @__PURE__ */ jsx4(Typography3, { variant: "caption", color: "text.secondary", children: variable.description })
                ] }, variable.token))
              }
            )
          ]
        }
      ),
      Object.entries(fieldDef.itemFields).map(([subKey, subFieldDef]) => /* @__PURE__ */ jsx4(
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
    /* @__PURE__ */ jsx4(DialogActions2, { sx: { p: 2 }, children: onDelete ? /* @__PURE__ */ jsxs4(Fragment, { children: [
      /* @__PURE__ */ jsx4(Button2, { variant: "outlined", color: "error", onClick: onDelete, children: "Delete" }),
      /* @__PURE__ */ jsx4(Button2, { variant: "contained", onClick: () => onConfirm(draft), children: confirmLabel })
    ] }) : /* @__PURE__ */ jsx4(
      Button2,
      {
        fullWidth: true,
        variant: "contained",
        onClick: () => onConfirm(draft),
        children: confirmLabel
      }
    ) })
  ] });
}

// src/components/DimensionSelect.tsx
import { Chip, MenuItem, Stack as Stack5, TextField, Typography as Typography4 } from "@mui/material";
import { jsx as jsx5, jsxs as jsxs5 } from "react/jsx-runtime";
function DimensionSelect({
  value,
  options,
  onChange,
  getChips,
  label,
  placeholder,
  disabled
}) {
  const renderOption = (optionValue) => {
    const option = options.find((candidate) => candidate.value === optionValue);
    if (!option) {
      return /* @__PURE__ */ jsx5(Typography4, { variant: "body2", color: "text.secondary", children: placeholder });
    }
    return /* @__PURE__ */ jsxs5(Stack5, { direction: "row", spacing: 1, alignItems: "center", children: [
      /* @__PURE__ */ jsx5("span", { children: option.label }),
      getChips?.(option.value).map((chip) => /* @__PURE__ */ jsx5(
        Chip,
        {
          size: "small",
          label: chip.label,
          color: chip.color
        },
        chip.label
      ))
    ] });
  };
  return /* @__PURE__ */ jsx5(
    TextField,
    {
      select: true,
      fullWidth: true,
      label,
      value,
      disabled,
      onChange: (event) => onChange(event.target.value),
      SelectProps: {
        displayEmpty: Boolean(placeholder),
        renderValue: (selected) => renderOption(String(selected))
      },
      children: options.map((option) => /* @__PURE__ */ jsx5(MenuItem, { value: option.value, children: renderOption(option.value) }, option.value))
    }
  );
}

// src/components/PreviewIframe.tsx
import { Box as Box3 } from "@mui/material";
import React4 from "react";
import { jsx as jsx6 } from "react/jsx-runtime";
function PreviewIframe({
  iframeRef,
  src,
  renderWidth,
  title = "Preview"
}) {
  const containerRef = React4.useRef(null);
  const [containerWidth, setContainerWidth] = React4.useState(0);
  React4.useEffect(() => {
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
  return /* @__PURE__ */ jsx6(Box3, { ref: containerRef, sx: { flex: 1, overflow: "hidden", p: 1.5, pt: 0 }, children: /* @__PURE__ */ jsx6(
    Box3,
    {
      sx: {
        width: "100%",
        maxWidth: renderWidth,
        height: "100%",
        overflow: "hidden",
        mx: "auto"
      },
      children: /* @__PURE__ */ jsx6(
        "iframe",
        {
          ref: iframeRef,
          src,
          title,
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

// src/components/LivePreview.tsx
import { jsx as jsx7 } from "react/jsx-runtime";
function LivePreview({
  previewUrl,
  src,
  content,
  renderWidth,
  pagePath,
  globals,
  title
}) {
  const { iframeRef } = usePreviewSender({
    previewUrl,
    content,
    pagePath,
    globals
  });
  return /* @__PURE__ */ jsx7(
    PreviewIframe,
    {
      iframeRef,
      src,
      renderWidth,
      title
    }
  );
}

// src/components/PageEditor.tsx
import { Box as Box5, Button as Button4, Stack as Stack7 } from "@mui/material";
import React6 from "react";

// src/components/PreviewDeviceSelect.tsx
import { Devices, KeyboardArrowDown } from "@mui/icons-material";
import { FormControl, MenuItem as MenuItem2, Select } from "@mui/material";
import { jsx as jsx8 } from "react/jsx-runtime";
var DEVICE_LABELS = {
  desktop: "Desktop",
  tablet: "Tablet",
  mobile: "Mobile"
};
function PreviewDeviceSelect({
  value,
  onChange,
  labels
}) {
  return /* @__PURE__ */ jsx8(FormControl, { size: "small", children: /* @__PURE__ */ jsx8(
    Select,
    {
      value,
      onChange: (event) => onChange(event.target.value),
      startAdornment: /* @__PURE__ */ jsx8(Devices, { sx: { fontSize: 18, color: "text.secondary", mr: 1 } }),
      IconComponent: KeyboardArrowDown,
      sx: { bgcolor: "background.paper" },
      children: Object.keys(DEVICE_LABELS).map((device) => /* @__PURE__ */ jsx8(MenuItem2, { value: device, children: labels?.[device] ?? DEVICE_LABELS[device] }, device))
    }
  ) });
}

// src/components/PreviewLayout.tsx
import { Box as Box4, Stack as Stack6 } from "@mui/material";
import React5 from "react";

// src/components/PreviewToggleButton.tsx
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Button as Button3 } from "@mui/material";
import { jsx as jsx9 } from "react/jsx-runtime";
function PreviewToggleButton({
  isPreviewVisible,
  onClick
}) {
  return /* @__PURE__ */ jsx9(
    Button3,
    {
      variant: "outlined",
      size: "small",
      startIcon: isPreviewVisible ? /* @__PURE__ */ jsx9(VisibilityOff, {}) : /* @__PURE__ */ jsx9(Visibility, {}),
      onClick,
      sx: { whiteSpace: "nowrap", bgcolor: "background.paper" },
      children: isPreviewVisible ? "Hide Preview" : "Show Preview"
    }
  );
}

// src/components/PreviewLayout.tsx
import { jsx as jsx10, jsxs as jsxs6 } from "react/jsx-runtime";
function PreviewLayout({
  children,
  preview,
  previewToolbar,
  previewWidth
}) {
  const [isPreviewVisible, setIsPreviewVisible] = React5.useState(true);
  return /* @__PURE__ */ jsxs6(Stack6, { direction: "row", sx: { flex: 1, height: "100%", minHeight: 0 }, children: [
    /* @__PURE__ */ jsxs6(
      Box4,
      {
        sx: {
          flex: 1,
          minWidth: 0,
          overflow: "auto",
          bgcolor: "background.level1"
        },
        children: [
          !isPreviewVisible && /* @__PURE__ */ jsx10(Box4, { sx: { px: 3, pt: 3 }, children: /* @__PURE__ */ jsx10(
            PreviewToggleButton,
            {
              isPreviewVisible: false,
              onClick: () => setIsPreviewVisible(true)
            }
          ) }),
          children
        ]
      }
    ),
    isPreviewVisible && /* @__PURE__ */ jsxs6(
      Stack6,
      {
        sx: {
          ...previewWidth ? { width: previewWidth, flexShrink: 0 } : { flex: 1, minWidth: 0 },
          bgcolor: "grey.200"
        },
        children: [
          /* @__PURE__ */ jsxs6(Stack6, { direction: "row", spacing: 1, sx: { p: 1.5, flexShrink: 0 }, children: [
            /* @__PURE__ */ jsx10(
              PreviewToggleButton,
              {
                isPreviewVisible: true,
                onClick: () => setIsPreviewVisible(false)
              }
            ),
            previewToolbar
          ] }),
          preview
        ]
      }
    )
  ] });
}

// src/components/PageEditor.tsx
import { jsx as jsx11, jsxs as jsxs7 } from "react/jsx-runtime";
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
  const [previewDevice, setPreviewDevice] = React6.useState("desktop");
  const isGlobal = globalPagePaths.includes(pagePath);
  const routePath = isGlobal ? GLOBAL_PREVIEW_PATH : previewPath ?? pagePath;
  const previewSrc = `${previewUrl}/${routePath === "home" ? "" : routePath}?preview`;
  return /* @__PURE__ */ jsxs7(
    Box5,
    {
      sx: { flex: 1, display: "flex", flexDirection: "column", minHeight: 0 },
      children: [
        /* @__PURE__ */ jsx11(
          PreviewLayout,
          {
            previewToolbar: /* @__PURE__ */ jsx11(
              PreviewDeviceSelect,
              {
                value: previewDevice,
                onChange: setPreviewDevice,
                labels: deviceLabels
              }
            ),
            preview: /* @__PURE__ */ jsx11(
              LivePreview,
              {
                previewUrl,
                src: previewSrc,
                content: previewContent,
                pagePath,
                globals: isGlobal ? { [pagePath]: previewContent } : void 0,
                renderWidth: preview_device_widths_default[previewDevice],
                title: "Page preview"
              }
            ),
            children: /* @__PURE__ */ jsx11(Box5, { sx: { p: 3, pb: 10 }, children: /* @__PURE__ */ jsx11(
              BlocksField_default,
              {
                blockTypes,
                field,
                renderers,
                previews,
                icons,
                errors
              }
            ) })
          }
        ),
        /* @__PURE__ */ jsx11(
          Stack7,
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
            children: /* @__PURE__ */ jsx11(
              Button4,
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

// src/components/PublishState.tsx
import { Chip as Chip2 } from "@mui/material";
import { format, isBefore, parseISO } from "date-fns";
import { jsx as jsx12 } from "react/jsx-runtime";
function PublishState({
  item
}) {
  const dateFormat = "dd MMM yyyy, HH:mm";
  if (item.publishAt) {
    const publishDate = parseISO(item.publishAt);
    if (isBefore(/* @__PURE__ */ new Date(), publishDate)) {
      return /* @__PURE__ */ jsx12(
        Chip2,
        {
          label: format(parseISO(item.publishAt), dateFormat),
          color: "info"
        }
      );
    }
    return /* @__PURE__ */ jsx12(
      Chip2,
      {
        label: format(parseISO(item.publishAt), dateFormat),
        color: "success"
      }
    );
  }
  return /* @__PURE__ */ jsx12(Chip2, { label: "Draft", color: "warning" });
}

// src/components/SeoEditor.tsx
import { Box as Box6, Button as Button5, Chip as Chip3, Stack as Stack8, Typography as Typography5 } from "@mui/material";
import { FieldText as FieldText2 } from "@m10c/mui-kit";
import { Fragment as Fragment2, jsx as jsx13, jsxs as jsxs8 } from "react/jsx-runtime";
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
  return /* @__PURE__ */ jsxs8(Stack8, { direction: "row", spacing: 1, alignItems: "center", children: [
    /* @__PURE__ */ jsx13(
      Chip3,
      {
        size: "small",
        label: isTooLong ? "Too long" : isGood ? "Good" : "Too short",
        color: isTooLong ? "error" : isGood ? "success" : "warning"
      }
    ),
    /* @__PURE__ */ jsxs8(Typography5, { variant: "caption", color: "text.secondary", children: [
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
  return /* @__PURE__ */ jsxs8(
    Box6,
    {
      sx: { flex: 1, display: "flex", flexDirection: "column", minHeight: 0 },
      children: [
        /* @__PURE__ */ jsx13(
          Box6,
          {
            sx: {
              flex: 1,
              overflow: "auto",
              p: 4,
              pb: 10,
              bgcolor: "background.level1"
            },
            children: /* @__PURE__ */ jsxs8(Stack8, { direction: "row", sx: { gap: "56px", justifyContent: "center" }, children: [
              /* @__PURE__ */ jsxs8(Stack8, { sx: { width: 571 }, spacing: 3, children: [
                /* @__PURE__ */ jsxs8(Stack8, { spacing: 1, children: [
                  renderers?.text ? renderers.text({
                    name: "pageTitle",
                    label: "Page Title",
                    value: pageTitleField.value ?? null,
                    onChange: pageTitleField.handleValueChange
                  }) : /* @__PURE__ */ jsxs8(Fragment2, { children: [
                    /* @__PURE__ */ jsx13(Typography5, { variant: "subtitle2", children: "Page Title" }),
                    /* @__PURE__ */ jsx13(
                      FieldText2,
                      {
                        field: pageTitleField,
                        hiddenLabel: true,
                        size: "small",
                        fullWidth: true
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsx13(CharacterCount, { value: pageTitle, min: 45, max: 60 })
                ] }),
                /* @__PURE__ */ jsxs8(Stack8, { spacing: 1, children: [
                  renderers?.textarea ? renderers.textarea({
                    name: "description",
                    label: "Description",
                    value: descriptionField.value ?? null,
                    onChange: descriptionField.handleValueChange
                  }) : /* @__PURE__ */ jsxs8(Fragment2, { children: [
                    /* @__PURE__ */ jsx13(Typography5, { variant: "subtitle2", children: "Description" }),
                    /* @__PURE__ */ jsx13(
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
                  /* @__PURE__ */ jsx13(CharacterCount, { value: description, min: 100, max: 150 })
                ] }),
                imageField && renderImageField && renderImageField(imageField)
              ] }),
              /* @__PURE__ */ jsxs8(Stack8, { sx: { width: 555 }, spacing: 3, children: [
                /* @__PURE__ */ jsxs8(Stack8, { spacing: 1, children: [
                  /* @__PURE__ */ jsx13(Typography5, { variant: "subtitle2", children: "Search Preview" }),
                  /* @__PURE__ */ jsx13(
                    Box6,
                    {
                      sx: {
                        bgcolor: "white",
                        borderRadius: "20px",
                        p: 2,
                        boxShadow: "0px 0px 0px 1px rgba(0,0,0,0.06), 0px 5px 22px 0px rgba(0,0,0,0.04)"
                      },
                      children: /* @__PURE__ */ jsxs8(Stack8, { spacing: 1.5, children: [
                        /* @__PURE__ */ jsxs8(Stack8, { direction: "row", spacing: 1, alignItems: "center", children: [
                          /* @__PURE__ */ jsx13(
                            Box6,
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
                          /* @__PURE__ */ jsxs8(Stack8, { children: [
                            /* @__PURE__ */ jsx13(
                              Typography5,
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
                            /* @__PURE__ */ jsx13(
                              Typography5,
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
                        /* @__PURE__ */ jsx13(
                          Typography5,
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
                        /* @__PURE__ */ jsx13(
                          Typography5,
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
                /* @__PURE__ */ jsxs8(Stack8, { spacing: 1, children: [
                  /* @__PURE__ */ jsx13(Typography5, { variant: "subtitle2", children: "Social Media Preview" }),
                  /* @__PURE__ */ jsxs8(
                    Box6,
                    {
                      sx: {
                        bgcolor: "white",
                        borderRadius: "20px",
                        overflow: "hidden",
                        boxShadow: "0px 0px 0px 1px rgba(0,0,0,0.06), 0px 5px 22px 0px rgba(0,0,0,0.04)"
                      },
                      children: [
                        /* @__PURE__ */ jsx13(
                          Box6,
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
                        /* @__PURE__ */ jsxs8(
                          Stack8,
                          {
                            sx: { bgcolor: "grey.100", px: 2, py: 1.5 },
                            spacing: 0.5,
                            children: [
                              /* @__PURE__ */ jsx13(
                                Typography5,
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
                              /* @__PURE__ */ jsx13(
                                Typography5,
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
                              /* @__PURE__ */ jsx13(
                                Typography5,
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
        /* @__PURE__ */ jsx13(
          Stack8,
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
            children: /* @__PURE__ */ jsx13(
              Button5,
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

// src/components/UnsavedChangesDialog.tsx
import {
  Button as Button6,
  Dialog as Dialog4,
  DialogActions as DialogActions3,
  DialogContent as DialogContent4,
  DialogContentText,
  DialogTitle as DialogTitle4
} from "@mui/material";
import { jsx as jsx14, jsxs as jsxs9 } from "react/jsx-runtime";
function UnsavedChangesDialog({
  open,
  onClose,
  onSave,
  onContinueWithoutSaving
}) {
  return /* @__PURE__ */ jsxs9(Dialog4, { open, onClose, maxWidth: "xs", fullWidth: true, children: [
    /* @__PURE__ */ jsx14(DialogTitle4, { children: "Unsaved changes" }),
    /* @__PURE__ */ jsx14(DialogContent4, { children: /* @__PURE__ */ jsx14(DialogContentText, { children: "You have unsaved changes. Save them before leaving, or continue without saving?" }) }),
    /* @__PURE__ */ jsxs9(DialogActions3, { children: [
      /* @__PURE__ */ jsx14(Button6, { onClick: onClose, color: "inherit", children: "Cancel" }),
      /* @__PURE__ */ jsx14(Button6, { onClick: onContinueWithoutSaving, color: "error", children: "Continue without saving" }),
      /* @__PURE__ */ jsx14(Button6, { onClick: onSave, variant: "contained", children: "Save" })
    ] })
  ] });
}

// src/contexts/VariantEditorContext.tsx
import React7 from "react";
import { jsx as jsx15 } from "react/jsx-runtime";
var VariantEditorContext = React7.createContext(
  null
);
function VariantEditorProvider({ children, ...value }) {
  const memoed = React7.useMemo(
    () => value,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      value.callApi,
      value.toast,
      value.push,
      value.getParams,
      value.setParams,
      value.defaultDimension
    ]
  );
  return /* @__PURE__ */ jsx15(VariantEditorContext.Provider, { value: memoed, children });
}
function useVariantEditorContext() {
  const context = React7.useContext(VariantEditorContext);
  if (!context) {
    throw new Error(
      "useVariantEditorContext must be used within a VariantEditorProvider"
    );
  }
  return context;
}

// src/hooks/use-variant-editor.ts
import React9 from "react";

// src/utils/dimension-value.ts
function dimensionValue(variant, key) {
  const value = variant[key];
  if (typeof value !== "string" && typeof value !== "number") {
    throw new Error(`Variant ${variant["@id"]} has no "${key}" value`);
  }
  return String(value);
}

// src/hooks/use-dimension-switcher.ts
import { useApiRead } from "api-read-hook";

// src/utils/publish-status-chip.ts
import { format as format2, isFuture, parseISO as parseISO2 } from "date-fns";
function publishStatusChip(publishAt) {
  if (!publishAt) return { label: "Draft", color: "warning" };
  const publishDate = parseISO2(publishAt);
  return {
    label: format2(publishDate, "dd MMM yyyy"),
    color: isFuture(publishDate) ? "info" : "success"
  };
}

// src/hooks/use-dimension-switcher.ts
function useDimensionSwitcher({
  dimension,
  variants,
  value,
  onValueChange,
  publishable = true
}) {
  const findVariant = (target) => variants.find(
    (variant) => dimensionValue(variant, dimension.key) === target
  ) ?? null;
  const currentVariant = findVariant(value);
  const defaultVariant = findVariant(dimension.defaultValue);
  const otherVariants = variants.filter(
    (variant) => variant !== currentVariant
  );
  const sourceVariant = (defaultVariant !== currentVariant ? defaultVariant : null) ?? (otherVariants.length === 1 ? otherVariants[0] ?? null : null);
  const detailRead = useApiRead(currentVariant?.["@id"] ?? null, {
    staleWhileInvalidated: true
  });
  const currentDetail = detailRead.data && detailRead.data["@id"] === currentVariant?.["@id"] ? detailRead.data : null;
  const hasDetailError = currentDetail === null && detailRead.error !== void 0;
  const getChips = (target) => {
    const chips = [];
    if (target === dimension.defaultValue) {
      chips.push({ label: "Default", color: "default" });
    }
    const variant = findVariant(target);
    if (publishable && variant)
      chips.push(publishStatusChip(variant.publishAt));
    return chips;
  };
  return {
    dimension,
    value,
    isDefault: value === dimension.defaultValue,
    currentVariant,
    sourceVariant,
    currentDetail,
    isLoadingDetail: currentVariant !== null && currentDetail === null && !hasDetailError,
    hasDetailError,
    reloadDetail: detailRead.invalidate,
    setValue: onValueChange,
    getLabel: (target) => dimension.options.find((option) => option.value === target)?.label ?? target,
    getChips
  };
}

// src/hooks/use-unsaved-changes-guard.ts
import { useRef, useState } from "react";
function useUnsavedChangesGuard({
  hasUnsavedChanges,
  onSave
}) {
  const [hasPending, setHasPending] = useState(false);
  const pendingActionRef = useRef(null);
  const guard = (action) => {
    if (hasUnsavedChanges) {
      pendingActionRef.current = action;
      setHasPending(true);
    } else {
      action();
    }
  };
  const guardNavigate = async (navigate) => {
    if (!hasUnsavedChanges) return true;
    guard(navigate);
    return false;
  };
  const handlePending = async (save) => {
    if (save) {
      const success = await onSave();
      if (!success) return;
    }
    pendingActionRef.current?.();
    pendingActionRef.current = null;
    setHasPending(false);
  };
  const dismissPending = () => {
    pendingActionRef.current = null;
    setHasPending(false);
  };
  return {
    guard,
    guardNavigate,
    hasUnsavedChanges,
    hasPending,
    handlePending,
    dismissPending
  };
}

// src/hooks/use-variant-actions.ts
import { useInvalidation } from "api-read-hook";
function useVariantActions({
  identityIri,
  variantsPath,
  entityLabel,
  listPath,
  dimension,
  variants,
  value,
  currentVariant
}) {
  const { callApi, toast, push } = useVariantEditorContext();
  const { invalidateMatching } = useInvalidation();
  const invalidate = () => invalidateMatching(identityIri);
  return {
    translate: async (fields, source) => {
      const response = await callApi(
        `${source["@id"]}/translate`,
        { method: "POST", jsonBody: { targetLocale: value, fields } }
      );
      return response?.data.translations ?? null;
    },
    submit: async (values, { addSubmitError, setLoading }) => {
      setLoading(true);
      const response = currentVariant ? await callApi(
        currentVariant["@id"],
        { method: "PATCH", jsonBody: values },
        { addSubmitError }
      ) : await callApi(
        variantsPath,
        {
          method: "POST",
          jsonBody: {
            ...values,
            identity: identityIri,
            [dimension.key]: value
          }
        },
        { addSubmitError }
      );
      setLoading(false);
      if (!response) return false;
      toast.success(`${entityLabel} saved`);
      invalidate();
      return true;
    },
    publish: async (publishAt) => {
      if (!currentVariant) return false;
      const response = await callApi(`${currentVariant["@id"]}/publish`, {
        method: "POST",
        jsonBody: { publishAt }
      });
      if (!response) return false;
      toast.success(`${entityLabel} published`);
      invalidate();
      return true;
    },
    unpublish: async () => {
      if (!currentVariant) return false;
      const response = await callApi(`${currentVariant["@id"]}/unpublish`, {
        method: "POST",
        jsonBody: {}
      });
      if (!response) return false;
      toast.success(`${entityLabel} unpublished`);
      invalidate();
      return true;
    },
    remove: async () => {
      if (!currentVariant) return false;
      const response = await callApi(currentVariant["@id"], {
        method: "DELETE"
      });
      if (!response) {
        toast.error(`Failed to delete ${entityLabel}`);
        return false;
      }
      if (variants.length === 1) {
        toast.success(`${entityLabel} deleted`);
        push(listPath);
      } else {
        toast.success(`${dimension.label} deleted`);
        invalidate();
      }
      return true;
    },
    invalidate
  };
}

// src/hooks/use-variant-form.ts
import React8 from "react";
import { useForm } from "react-typed-form";
var useIsomorphicLayoutEffect = typeof window === "undefined" ? React8.useEffect : React8.useLayoutEffect;
function useVariantForm({
  savedValues,
  resetKey,
  onSubmit
}) {
  const form = useForm({
    defaultValues: {},
    pristineValues: savedValues,
    onSubmit
  });
  const { reset } = form;
  useIsomorphicLayoutEffect(() => {
    reset();
  }, [resetKey]);
  return form;
}

// src/hooks/use-variant-editor.ts
function useVariantEditor({
  identityIri,
  variantsPath,
  entityLabel,
  listPath,
  variants,
  toFormValues,
  dimension: dimensionOverride,
  publishable = true,
  postValidateTransform
}) {
  const { getParams, setParams, defaultDimension } = useVariantEditorContext();
  const dimension = dimensionOverride ?? defaultDimension;
  const firstVariant = variants[0];
  const initialValue = dimension.defaultValue ?? (firstVariant ? dimensionValue(firstVariant, dimension.key) : dimension.options[0]?.value);
  if (!initialValue) {
    throw new Error(`Dimension "${dimension.key}" has no options`);
  }
  const switcher = useDimensionSwitcher({
    dimension,
    variants,
    value: getParams()[dimension.key] ?? initialValue,
    onValueChange: (next) => setParams({ [dimension.key]: next }),
    publishable
  });
  const { currentVariant, currentDetail, sourceVariant, value } = switcher;
  const actions = useVariantActions({
    identityIri,
    variantsPath,
    entityLabel,
    listPath,
    dimension,
    variants,
    value,
    currentVariant
  });
  const savedValues = React9.useMemo(
    () => toFormValues(currentDetail),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentDetail]
  );
  const form = useVariantForm({
    savedValues,
    resetKey: `${currentVariant?.["@id"] ?? `new:${value}`}:${currentDetail?.updatedAt ?? ""}`,
    onSubmit: async (values, { addSubmitError, setLoading }) => {
      const body = postValidateTransform ? postValidateTransform(values) : values;
      const success = await actions.submit(body, {
        addSubmitError: (field, error) => addSubmitError(field, error),
        setLoading
      });
      if (success) switcher.reloadDetail();
      return success;
    }
  });
  const guard = useUnsavedChangesGuard({
    hasUnsavedChanges: form.hasDirty,
    onSave: () => form.handleSubmit()
  });
  const remove = async () => {
    if (!currentVariant) return false;
    const success = await actions.remove();
    if (!success) return false;
    const remaining = variants.find(
      (variant) => variant["@id"] !== currentVariant["@id"]
    );
    if (remaining) switcher.setValue(dimensionValue(remaining, dimension.key));
    return true;
  };
  return {
    entityLabel,
    dimension,
    variants,
    publishable,
    switcher,
    form,
    guard,
    actions,
    canTranslate: Boolean(dimension.translatable) && sourceVariant !== null,
    isPublished: currentVariant?.publishAt != null,
    isNewVariant: currentVariant === null,
    isLastVariant: variants.length === 1,
    switchTo: (next) => guard.guard(() => switcher.setValue(next)),
    save: () => form.handleSubmit(),
    remove
  };
}

// src/utils/create-block.ts
function createBlock(blockType) {
  return {
    type: blockType.key,
    data: Object.fromEntries(
      Object.entries(blockType.fields).map(([key, fieldDef]) => [
        key,
        emptyFieldValue(fieldDef)
      ])
    )
  };
}
export {
  AddBlockDialog,
  BlockCardFrame,
  BlocksField_default as BlocksField,
  ConfirmDialog,
  DimensionSelect,
  LivePreview,
  preview_device_widths_default as PREVIEW_DEVICE_WIDTHS,
  preview_message_default as PREVIEW_MESSAGE,
  PageEditor,
  PreviewDeviceSelect,
  PreviewIframe,
  PreviewLayout,
  PreviewToggleButton,
  PublishState,
  SeoEditor,
  UnsavedChangesDialog,
  VariantEditorProvider,
  createBlock,
  dimensionValue,
  moveItem,
  useDragReorder,
  useDraggableByHandle,
  usePreviewSender,
  useVariantEditor,
  useVariantEditorContext,
  useWebsiteGlobalData,
  useWebsitePageData
};
//# sourceMappingURL=index.js.map