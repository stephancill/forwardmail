import React from "react";
import browser from "webextension-polyfill";

function AliasElement(props) {
    let alias = props.alias
    let actionHandler = props.actionHandler
    return (
      <li>
        <span className={"alias-name value"}>{alias.name}</span>
        <span className={"alias-actions"}>
          <button className={"alias-copy"} title="Copy address" onClick={() => actionHandler(alias.id, "copy")}><clr-icon shape="copy" size="21"></clr-icon></button>
          <button className={"alias-disconnect"} title={alias.is_disconnected ? "Reconnect" : "Disconnect"} onClick={() => actionHandler(alias.id, "disconnect")}>
            <clr-icon shape={alias.is_disconnected ? 'connect' : 'disconnect'} size="21"></clr-icon>
          </button>
          <button className={"alias-delete"} title="Remove" onClick={() => actionHandler(alias.id, "delete")}><clr-icon shape="trash" size="21"></clr-icon></button>
        </span>
        <span className={"alias-address value"}>{alias.proxy_address}</span>
      </li>
    )
}

export default AliasElement